import { Component } from '@angular/core';
import { faPencil, faTrash } from '@fortawesome/free-solid-svg-icons'
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { v4 as uuid } from 'uuid'
import { TicketManagementService } from '../../service/ticket-management.service';
import { Badge } from '../../interface/badge'
import { NzMessageService } from 'ng-zorro-antd/message';
import { Card } from '../../interface/card'
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-add-badge-modal',
  templateUrl: './add-badge-modal.component.html',
  styleUrls: ['./add-badge-modal.component.scss']
})

export class AddBadgeModalComponent {

  faIconEdit = faPencil;
  faDeleteIcon = faTrash;
  isBadgeModalVisible: boolean = false;
  badgeData: Badge[] = [];
  selectedId!: string;
  isEdit: boolean = false;
  viewCardData: Card[] = [];

  badgeFormData: FormGroup = new FormGroup({
    badgeName: new FormControl('', Validators.required),
    badgecolor: new FormControl('', Validators.required),
    id: new FormControl(uuid())
  })

  constructor(private badgeService: TicketManagementService, private message: NzMessageService) { }

  ngOnInit() {
    this.getBadgeData();
    this.getCardsData();
  }

  getBadgeData() {
    this.badgeService.getAllBadges().subscribe({
      next: (badge) => this.badgeData = badge,
      error: (error) => this.message.error(error)
    });
  }

  getCardsData() {
    this.badgeService.getCardData().subscribe({
      next: (data) => this.viewCardData = data
    });
  }

  openModal() {
    this.isBadgeModalVisible = true;
  }

  addBadge() {
    if (!this.badgeFormData.valid) {
      Object.values(this.badgeFormData.controls).forEach((control: AbstractControl) => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
      return;
    }

    if (this.isEdit) {
      this.badgeService.editBadge(this.selectedId, this.badgeFormData.value,).subscribe({
        next: () => {
          this.message.info("Your badge is edited successfully!");
          this.getBadgeData();
          this.editCardData(this.selectedId);
          this.badgeService.triggerBadgeUpdate();
          this.badgeFormData.reset();
        },
        error: (error) => this.message.error(error)
      })
    }
    else {
      this.badgeService.saveBadge(this.badgeFormData.value).subscribe({
        next: () => {
          this.message.info("New badge is added successfully!");
          this.getBadgeData();
          this.badgeService.triggerBadgeUpdate();
          this.badgeFormData.reset();
        },
        error: (error) => this.message.error(error)
      })
    }
  }

  handleCancel() {
    this.isBadgeModalVisible = false;
  }

  resetForm() {
    this.badgeFormData.reset();
    this.isEdit = false;
  }

  editBadge(id: string) {
    this.selectedId = id;
    this.isEdit = true;
    this.badgeData.filter(badge => {
      if (badge.id === id) {
        this.badgeFormData.patchValue({
          badgeName: badge.badgeName,
          badgecolor: badge.badgecolor
        })
      }
    });
  }

  deleteBadge(id: string) {
    this.badgeService.deleteBadge(id).subscribe({
      next: () => {
        this.message.info("Badge is deleted successfully!");
        this.getBadgeData();
        this.deleteCardData(this.selectedId)
        this.badgeService.triggerBadgeUpdate();
      },
      error: (error) => this.message.error(error)
    })
  }

  editCardData(id: string) {
    const badgeId = id;
    const updateObservables = [];
  
    for (const card of this.viewCardData) {
      for (const badge of card.selectedBadges) {
        if (badge.badgeId === badgeId) {
          badge.badgeColor = this.badgeFormData.value.badgecolor;
          badge.badgeName = this.badgeFormData.value.badgeName;
          const updateObservable = this.badgeService.updateCardData(card.id, card);
          updateObservables.push(updateObservable);
        }
      }
    }
  
    // Use forkJoin to wait for all update observables to complete
    forkJoin(updateObservables).subscribe({
      next: () => {
        this.message.success("Cards data updated!");
        // Trigger badge update after updating all cards
        this.badgeService.triggerBadgeUpdate();
      },
      error: (error) => this.message.error(error)
    });
  }

  deleteCardData(id: string) {

  }
}

