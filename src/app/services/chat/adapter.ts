import { ChatAdapter, IChatGroupAdapter, Group, Message, ChatParticipantStatus, ParticipantResponse, ChatParticipantType } from 'ng-chat';
import { Observable, of } from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from '../../../environments/environment';

export class DemoAdapter extends ChatAdapter implements IChatGroupAdapter {

  private url = '/api';

  constructor(private user: string, private http: HttpClient) {
    super();

    if (environment.production) {
      this.url = 'http://18.224.180.162/api';
    } else {
      this.url = '/api';
    }
  }

  listFriends(): Observable<ParticipantResponse[]> {
    const endpoint = 'methods/message/chats/list.php';
    const params = {
      id: this.user
    };

    const headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json');

    return this.http.post(this.url + '/' + endpoint, params, {headers}).pipe(
      map((res: any) => {

        const uniqueIds = [];
        const participantsFiltered = res.data;
        res.data.forEach((chat, index) => {
          const id = chat.from != this.user ? chat.from : chat.to;

          if (uniqueIds.indexOf(id) < 0) {
            uniqueIds.push(id);
          } else {
            participantsFiltered.splice(index, 1);
          }
        });

        return res.data.map(c => {
          const otherUserIsFrom = c.from != this.user;
          return {
            participant: {
              participantType: ChatParticipantType.User,
              id: otherUserIsFrom ? c.from : c.to,
              displayName: otherUserIsFrom ? c.from_fname + ' ' + c.from_lname : c.to_fname + ' ' + c.to_lname,
              avatar: 'http://18.224.180.162/api/resources/profile/avatar/'.concat(otherUserIsFrom ? c.from : c.to).concat('.jpg'),
              status: ChatParticipantStatus.Offline
            }
          };
        });
      }),
      catchError((error: any) => Observable.throw(error.error || 'Server error'))
    );
  }

  getMessageHistory(destinataryId: any): Observable<Message[]> {
    const endpoint = 'methods/message/chats/get.php';
    const params = {
      user: this.user,
      other: destinataryId,
    };

    const headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json');

    return this.http.post(this.url + '/' + endpoint, params, {headers}).pipe(
      map((res: any) => {
        return res.data.map(m => {
          return {
            fromId: m.from,
            toId: m.to,
            message: m.message,
            dateSent: m.date
          };
        });
      }),
      catchError((error: any) => Observable.throw(error.error || 'Server error'))
    );
  }

  sendMessage(message: Message): void {
    const endpoint = 'methods/message/chats/create.php';
    const params = {
      from: message.fromId,
      to: message.toId,
      message: message.message
    };
    
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json');

    this.http.post(this.url + '/' + endpoint, params, {headers}).toPromise().then(r => console.log(r));
  }

  groupCreated(group: Group): void {
  }
}
