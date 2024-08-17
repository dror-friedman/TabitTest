import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule, NgForm } from '@angular/forms';
import { NzModalService, NzModalRef } from 'ng-zorro-antd/modal';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzTableModule, NzTableSortOrder } from 'ng-zorro-antd/table';

@Component({
  selector: 'app-demo',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule, NzButtonModule, NzTableModule],
  templateUrl: './demo.component.html',
  styleUrls: ['./demo.component.css']
})
export class DemoComponent implements OnInit {
  users: any[] = [];
  selectedUser: any = {};
  modalRef!: NzModalRef;
  @ViewChild('userForm') userForm!: NgForm;

  sortMap: { [key: string]: NzTableSortOrder | null } = {
    name: null,
    email: null,
    phone: null,
    website: null,
  };

  @ViewChild('editUserModal', { static: true }) editUserModal!: TemplateRef<any>;

  constructor(private http: HttpClient, private modal: NzModalService) {}

  ngOnInit() {
    this.fetchUsers();
  }

  fetchUsers() {
    this.http.get<any[]>('https://jsonplaceholder.typicode.com/users')
      .subscribe(response => {
        console.log('Fetched users:', response);
        this.users = response;
      }, error => {
        console.error('Error fetching users:', error);
      });
  }

  isMobileDevice(): boolean {
    return /Mobi|Android/i.test(navigator.userAgent);
  }

  openModal(user: any) {
    this.selectedUser = { ...user };
    console.log('Selected user:', this.selectedUser);
  
    this.modalRef = this.modal.create({
      nzTitle: 'Edit User Details',
      nzContent: this.editUserModal,
      nzWidth: '90%',  // Adjust width for mobile screens
      nzOnOk: () => this.saveUser(),
      nzOnCancel: () => this.closeModal(),
      nzOkDisabled: !this.isFormValid()
    });

    setTimeout(() => {
      if (this.userForm) {
        this.userForm.valueChanges?.subscribe(() => {
          this.modalRef.updateConfig({
            nzOkDisabled: !this.isFormValid()
          });
        });
      }
    });
  }

  onClickOrTap(user: any) {
    if (this.isMobileDevice()) {
      // On mobile, open modal on a single tap
      this.openModal(user);
    }
    // On desktop, wait for double-click instead (do nothing on single click)
  }

  onDoubleClick(user: any) {
    if (!this.isMobileDevice()) {
      // On desktop, open modal on a double-click
      this.openModal(user);
    }
  }

  closeModal() {
    this.selectedUser = {};
    this.modalRef.destroy();
  }

  saveUser() {
    console.log('Saving user:', this.selectedUser);

    if (this.isFormValid()) {
      const index = this.users.findIndex(user => user.id === this.selectedUser.id);
      if (index !== -1) {
        this.users[index] = { ...this.selectedUser };
      }
      this.closeModal();
    } else {
      console.log('Form is invalid');
    }
  }

  isFormValid(): boolean {
    const isValid = this.userForm?.valid ?? false;
    console.log('Form Validity:', isValid);
    return isValid;
  }

  isValid(value: any, field: string): boolean {
    if (field === 'name' || field === 'phone') {
      return value && new RegExp(this.getPattern(field)).test(value);
    }
    if (field === 'email' || field === 'website') {
      return !value || new RegExp(this.getPattern(field)).test(value);
    }
    return true;
  }

  getPattern(field: string): string {
    const patterns: { [key: string]: string } = {
      name: '^[A-Za-z ]+$',
      phone: '^\\+9725[0-9]{8}$',
      email: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$',
      website: 'https?://.+'
    };
    return patterns[field] || '';
  }

  sortData(sortKey: string, sortOrder: NzTableSortOrder | null) {
    this.sortMap = {
      name: null,
      email: null,
      phone: null,
      website: null,
    };
    this.sortMap[sortKey] = sortOrder;

    this.users.sort((a, b) => {
      if (sortOrder === 'ascend') {
        return a[sortKey] > b[sortKey] ? 1 : -1;
      } else if (sortOrder === 'descend') {
        return a[sortKey] < b[sortKey] ? 1 : -1;
      } else {
        return 0;
      }
    });
  }
}
