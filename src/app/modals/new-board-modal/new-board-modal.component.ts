import { Component, EventEmitter, Output } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { v4 as uuid } from 'uuid';
import { TicketManagementService } from '../../service/ticket-management.service'
import { ToastrService } from 'ngx-toastr';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-new-board-modal',
  templateUrl: './new-board-modal.component.html',
  styleUrls: ['./new-board-modal.component.scss']
})
export class NewBoardModalComponent {
  @Output() newBoardData = new EventEmitter();
  isVisible = false;
  isEdit: boolean = false;
  idToEdit!: string;

  newBoardFormData: FormGroup = new FormGroup({
    boardName: new FormControl('', Validators.required),
    boardColor: new FormControl('', Validators.required),
  })

  constructor(private boardService: TicketManagementService, private message:NzMessageService) { }

  openModal(mode?: string, id?: string) {
    this.isVisible = true;
    if (mode && id) {
      this.isEdit = true;
      this.idToEdit = id as string;
      this.boardService.getBoards().subscribe({
        next: (board) => {
          board.filter(item => item.id === id).forEach((board) => {
            this.newBoardFormData.patchValue({
              boardName: board.boardName,
              boardColor: board.boardColor,
              loggedUserId: this.boardService.getLoggedInUser(),
              projectID: this.boardService.getLatestProjectID(),
              id: this.idToEdit
            })
          })
        },
        error: (error) => this.message.error(error)
      })
    }
  }

  handleCancel() {
    this.newBoardFormData.reset();
    this.isVisible = false;
    this.isEdit = false;
  }

  addNewBoardData() {
    if (!this.newBoardFormData.valid) {
      Object.values(this.newBoardFormData.controls).forEach((control: AbstractControl) => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
      return;
    }
    const capital = this.newBoardFormData.value.boardName.toUpperCase();
    this.newBoardFormData.value.boardName = capital;
    this.newBoardFormData.value.loggedUserId = this.boardService.getLoggedInUser();
    this.newBoardFormData.value.projectID = this.boardService.getLatestProjectID();

    if (!this.isEdit) {
      this.newBoardFormData.value.id = uuid();
      this.boardService.setBoardId(this.newBoardFormData.value.id);
      this.boardService.saveBoard(this.newBoardFormData.value).subscribe({
        next: () => {
          this.message.success("Board name added successfully!")
          this.newBoardData.emit(this.newBoardFormData.value);
          this.handleCancel();
        },
        error: (error) => this.message.error(error)
      })
    }
    else {
      this.boardService.updateBoard(this.idToEdit, this.newBoardFormData.value).subscribe({
        next: () => {
          this.message.info("Board name edited successfully!")
          this.newBoardData.emit(this.newBoardFormData.value);
          this.handleCancel();
        },
        error: (error) => this.message.error(error)
      })
    }
  }
}
