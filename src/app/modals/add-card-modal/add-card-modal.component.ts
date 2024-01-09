import { Component, EventEmitter, KeyValueDiffers, Output } from '@angular/core';
import { TicketManagementService } from '../../service/ticket-management.service'
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { v4 as uuid } from 'uuid';
import { Badge } from '../../interface/badge';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ChangeDetectorRef } from '@angular/core';


@Component({
  selector: 'app-add-card-modal',
  templateUrl: './add-card-modal.component.html',
  styleUrls: ['./add-card-modal.component.scss']
})
export class AddCardModalComponent {
  @Output() addNewCardModal = new EventEmitter();

  isVisible = false;
  usersList: string[] = [];
  badgesList: Badge[] = [];
  selectedBoardId!: string;

  newCardFormData: FormGroup = new FormGroup({
    taskName: new FormControl('', Validators.required),
    selectedUsers: new FormControl([], Validators.required),
    selectedBadges: new FormControl([])
  })

  constructor(private cardService: TicketManagementService, private message: NzMessageService, private cdr: ChangeDetectorRef) {
    this.cardService.badgeUpdate$.subscribe(() => {
      this.refreshCardData();
      this.cdr.detectChanges();
    });
  }

  refreshCardData() {
    console.log('Refreshing card data...');
    this.getUpdatedCardData();
  }

  getUpdatedCardData() {
    this.cardService.getAllBadges().subscribe({
      next: (badge) => this.badgesList = badge,
      error: (error) => this.message.error(error)
    })
  }

  ngOnInit() {
    this.getUpdatedCardData();
  }

  openModal(id: string) {
    this.isVisible = true;
    this.usersList = this.cardService.getSelectedUsers();
    this.selectedBoardId = id;
  }

  handleCancel() {
    this.newCardFormData.reset();
    this.isVisible = false;
  }

  addNewCardData() {
    if (!this.newCardFormData.valid) {
      Object.values(this.newCardFormData.controls).forEach((control: AbstractControl) => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
      return;
    }

    this.newCardFormData.value.id = uuid();
    this.newCardFormData.value.loggedUserId = this.cardService.getLoggedInUser();
    this.newCardFormData.value.projectId = this.cardService.getLatestProjectID();
    this.newCardFormData.value.boardId = this.selectedBoardId;

    if (this.cardService.getBoardId() === this.selectedBoardId) {
      this.newCardFormData.value.cardIndex = 1;
    }
    else {
      this.newCardFormData.value.cardIndex = this.cardService.getCardIndex() + 1;
    }
    this.cardService.saveCardData(this.newCardFormData.value).subscribe({
      next: () => {
        this.message.success("New task added successfully!");
        this.addNewCardModal.emit(this.newCardFormData.value);
        this.cardService.setCardIndex(this.cardService.getCardIndex() + 1);
        this.handleCancel();
      },
      error: (error) => this.message.error(error)
    });
  }
}


