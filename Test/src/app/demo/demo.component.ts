import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-demo',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule],
  templateUrl: './demo.component.html',
  styleUrls: ['./demo.component.css']
})
export class DemoComponent implements OnInit {
  users: any[] = [];
  selectedUser: any = {};
  isModalOpen: boolean = false;
  touchStartTime: number = 0;
  touchDurationThreshold: number = 300; // Shorter duration in milliseconds to detect tap-and-hold
  touchMoved: boolean = false;

  constructor(private http: HttpClient) {}

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

  openModal(user: any) {
    this.selectedUser = { ...user };
    console.log('Selected user:', this.selectedUser);
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
    this.selectedUser = {};
  }

  saveUser() {
    console.log('Saving user:', this.selectedUser);
    const index = this.users.findIndex(user => user.id === this.selectedUser.id);
    if (index !== -1) {
      this.users[index] = { ...this.selectedUser };
    }
    this.closeModal();
  }

  isInvalidName(name: string): boolean {
    const namePattern = /^[A-Za-z ]+$/;
    return !namePattern.test(name);
  }

  isInvalidPhone(phone: string): boolean {
    const phonePattern = /^(\+9725[0-9]{8})$/;
    return !phonePattern.test(phone);
  }

  isInvalidWebsite(website: string): boolean {
    if (!website) {
      return false; // Consider empty website as valid if not required
    }
    const websitePattern = /^https?:\/\/.+$/;
    return !websitePattern.test(website);
  }

  handleDoubleClick(user: any) {
    this.openModal(user);
  }

  handleTouchStart(event: TouchEvent) {
    this.touchStartTime = new Date().getTime();
    this.touchMoved = false;
  }

  handleTouchMove() {
    this.touchMoved = true;
  }

  handleTouchEnd(user: any) {
    const touchEndTime = new Date().getTime();
    const touchDuration = touchEndTime - this.touchStartTime;

    if (!this.touchMoved && touchDuration > this.touchDurationThreshold) {
      this.openModal(user);
    }
  }
}
