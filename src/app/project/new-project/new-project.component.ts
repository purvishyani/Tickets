import { Component, ViewChild } from '@angular/core';
import { AddBadgeModalComponent } from '../../modals/add-badge-modal/add-badge-modal.component';
import { TicketManagementService } from '../../service/ticket-management.service';
import { AddProjectModalComponent } from '../../modals/add-project-modal/add-project-modal.component';
import { NewBoardModalComponent } from '../../modals/new-board-modal/new-board-modal.component';
import { AddCardModalComponent } from '../../modals/add-card-modal/add-card-modal.component';
import { ActivatedRoute } from '@angular/router';
import { CdkDragDrop, moveItemInArray, transferArrayItem, } from '@angular/cdk/drag-drop';
import { AddNewUserModalComponent } from '../../modals/add-new-user-modal/add-new-user-modal.component';
import { Project } from '../../interface/project';
import { Board } from '../../interface/board';
import { Card } from '../../interface/card';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-new-project',
  templateUrl: './new-project.component.html',
  styleUrls: ['./new-project.component.scss']
})
export class NewProjectComponent {
  @ViewChild('badgeModal') badgeModal!: AddBadgeModalComponent;
  @ViewChild('addNewProjectModal') addNewProjectModal!: AddProjectModalComponent;
  @ViewChild('addNewBoard') addNewBoard!: NewBoardModalComponent;
  @ViewChild('addNewCardModal') addNewCardModal!: AddCardModalComponent;
  @ViewChild('addNewUserModal') addNewUserModal!: AddNewUserModalComponent;

  viewProjectData: Project[] = [];
  viewBoardData: Board[] = [];
  viewCardData: Card[] = [];
  projectId!: string;
  projectName!: string;
  selectedUsersOnProject: string[] = [];
  loggedInUser: string = this.projectService.getLoggedInUser();
  paramId!: string;
  dropLists: string[] = [];
  isVisible: boolean = false;

  constructor(private projectService: TicketManagementService, private route: ActivatedRoute, private message: NzMessageService) {
    this.paramId = this.route.snapshot.paramMap.get('id') as string;
  }

  ngOnInit() {
    this.showBoardData();
    this.showProjectData();
    this.showCardData();
  }

  showAddNewUserModal() {
    this.addNewUserModal.openModal();
  }

  showBadgeModal(): void {
    this.badgeModal.openModal();
  }

  showNewProjectModal() {
    this.addNewProjectModal.openModal();
  }

  showNewBoardModal(mode?: string, id?: string) {
    if (!mode && !id) {
      this.addNewBoard.openModal();
    }
    else {
      this.addNewBoard.openModal(mode, id);
    }
  }

  showTaskCardModal(boardId: string) {
    this.addNewCardModal.openModal(boardId);
  }

  showProjectData(projectData?: Project) {
    if (projectData) {
      this.projectId = projectData.id;
      this.projectName = projectData.projectName;
      this.selectedUsersOnProject = projectData.selectedUsers;
      this.isVisible = true;
    }
    else {
      if (this.paramId) {
        this.projectService.getProjects().subscribe({
          next: (project) => {
            this.viewProjectData = project.filter((item) => item.id === this.paramId);
            this.viewProjectData.forEach((item) => {
              this.projectId = item.id;
              this.projectName = item.projectName;
              this.selectedUsersOnProject = item.selectedUsers;
              this.projectService.setSelectedUsers(this.selectedUsersOnProject);
              this.projectService.setLastAddedProjectID(this.projectId);
              this.isVisible = true;
            })
          },
          error: (error) => this.message.error(error)
        })
      }
    }
  }

  showBoardData(boardData?: Board) {
    this.projectService.getBoards().subscribe({
      next: (board) => {
        if (boardData) {
          this.viewBoardData = board.filter((item) => item.projectID === this.projectService.getLatestProjectID());
        }
        else {
          this.viewBoardData = board.filter((item) => item.projectID === this.paramId);
          this.viewBoardData.forEach((item) => {
            this.projectService.setBoardId(item.id);
          })
        }
      },
      error: (error) => this.message.error(error)
    })
  }

  showCardData(cardData?: Card) {
    this.projectService.getCardData().subscribe({
      next: (card) => {
        if (cardData) {
          this.viewCardData = card;
        }
        else {
          this.viewCardData = card.filter((item) => item.projectId === this.paramId);
        }
      },
      error: (error) => this.message.error(error)
    });
  }

  updateProjectTitle(updatedProjectName: string) {
    this.viewProjectData.forEach((item) => {
      item.projectName = updatedProjectName;
      this.projectService.updateProject(this.projectId, item).subscribe({
        next: () => this.message.info("Project title is updated!"),
        error: (error) => this.message.error(error)
      });
    })
  }

  drop(event: CdkDragDrop<any[]>) {
      const cardId = this.viewCardData[event.previousIndex]?.id;
      const cardIndex = cardId ? this.viewCardData.findIndex(card => card.id === cardId) : -1;

      if (cardIndex !== -1) {
        let draggedCardData!: Card;
        this.viewCardData[cardIndex].boardId = event.container.id;
        this.viewCardData.forEach((item) => {
          if (item.id === cardId) {
            item.boardId = event.container.id;
            draggedCardData = item;
          }
        });

        this.projectService.updateCardData(cardId, draggedCardData).subscribe({
          next: () => this.message.info("Card updated successfully"),
          error: (error) => this.message.error(error)
        });

        transferArrayItem(
          event.previousContainer.data,
          event.container.data,
          event.previousIndex,
          event.currentIndex
        );
      }
  }

  confirmDelete(id: string) {
    this.projectService.deleteBoard(id).subscribe({
      next: () => {
        this.message.info("Card deleted successfully");
        this.showBoardData();
      },
      error: (error) => this.message.error(error)
    });
  }
}






