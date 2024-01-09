import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Observable, Subject } from 'rxjs';
import { Badge } from '../interface/badge';
import { Project } from '../interface/project';
import { Board } from '../interface/board';
import { Card } from '../interface/card';
import { Users } from '../interface/users'

@Injectable({
  providedIn: 'root'
})

export class TicketManagementService {

  url: string = 'http://localhost:3000';
  storageKey: string = "loggedInUser";
  loggedIn!: string;
  latestProjectId!: string;
  boardId!: string;
  selectedUsers: string[] = [];
  cardIndex: number = 0;

  constructor(private http: HttpClient) { }

  getLoggedInUser() {
    const storedUser = sessionStorage.getItem(this.storageKey);
    return storedUser ? JSON.parse(storedUser) : null;
  }

  setLoggedInUser(loggedInId: string) {
    sessionStorage.setItem(this.storageKey, JSON.stringify(loggedInId));
  }

  getLatestProjectID() {
    return this.latestProjectId;
  }

  setLastAddedProjectID(projectID: string) {
    this.latestProjectId = projectID;
  }

  setSelectedUsers(users: string[]) {
    this.selectedUsers = users;
  }

  getSelectedUsers() {
    return this.selectedUsers;
  }

  getBoardId() {
    return this.boardId;
  }

  setBoardId(boardId: string) {
    this.boardId = boardId;
  }

  getCardIndex() {
    return this.cardIndex;
  }

  setCardIndex(index: number) {
    this.cardIndex = index;
  }

  // Registration Data
  saveUsers(usersData: Users): Observable<Users> {
    return this.http.post<Users>(`${this.url}/tickets`, usersData);
  }
  getUsers(): Observable<Users[]> {
    return this.http.get<Users[]>(`${this.url}/tickets`);
  }

  // Badge Data
  saveBadge(badgeData: Badge): Observable<Badge> {
    return this.http.post<Badge>(`${this.url}/badges`, badgeData);
  }

  getAllBadges(): Observable<Badge[]> {
    return this.http.get<Badge[]>(`${this.url}/badges`);
  }

  editBadge(id: string, updatedBadgeData: Badge): Observable<Badge> {
    return this.http.put<Badge>(`${this.url}/badges/${id}`, updatedBadgeData);
  }

  deleteBadge(id: string): Observable<Badge> {
    return this.http.delete<Badge>(`${this.url}/badges/${id}`);
  }
  
// ==============================================
  private badgeUpdateSubject = new Subject<void>();

  badgeUpdate$ = this.badgeUpdateSubject.asObservable();

  triggerBadgeUpdate() {
    this.badgeUpdateSubject.next();
  }
// ==============================================

  // NEW PROJECT DATA
  saveProject(projectData: Project): Observable<Project> {
    return this.http.post<Project>(`${this.url}/projects`, projectData);
  }

  getProjects(): Observable<Project[]> {
    return this.http.get<Project[]>(`${this.url}/projects`);
  }

  updateProject(projectId: string, projectData: Project): Observable<Project> {
    return this.http.put<Project>(`${this.url}/projects/${projectId}`, projectData);
  }

  // BOARD DATA
  saveBoard(boardData: Board): Observable<Board> {
    return this.http.post<Board>(`${this.url}/boards`, boardData);
  }

  getBoards(): Observable<Board[]> {
    return this.http.get<Board[]>(`${this.url}/boards`);
  }

  updateBoard(id: string, boardData: Board): Observable<Board> {
    return this.http.put<Board>(`${this.url}/boards/${id}`, boardData);
  }

  deleteBoard(id: string): Observable<Board> {
    return this.http.delete<Board>(`${this.url}/boards/${id}`);
  }

  // CARD DATA
  saveCardData(cardData: Card): Observable<Card> {
    return this.http.post<Card>(`${this.url}/cards`, cardData);
  }

  getCardData(): Observable<Card[]> {
    return this.http.get<Card[]>(`${this.url}/cards`)
  }

  updateCardData(boardId: string, cardData: Card): Observable<Card> {
    return this.http.put<Card>(`${this.url}/cards/${boardId}`, cardData);
  }

}
