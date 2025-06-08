import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ChatMessage {
  message: string;
  history: Array<{role: string, content: string}>;
}

export interface ChatResponse {
  response: string;
  error?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private apiUrl = 'http://localhost:8000';

  constructor(private http: HttpClient) {}

  sendMessage(message: string, history: Array<{role: string, content: string}> = []): Observable<ChatResponse> {
    const payload: ChatMessage = {
      message,
      history
    };

    return this.http.post<ChatResponse>(`${this.apiUrl}/chat`, payload);
  }

  sendMessageStream(message: string, history: Array<{role: string, content: string}> = []): Observable<string> {
    return new Observable(observer => {
      const payload: ChatMessage = {
        message,
        history
      };

      fetch(`${this.apiUrl}/chat/stream`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      })
      .then(response => {
        if (!response.body) {
          throw new Error('No response body');
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();

        const readStream = () => {
          reader.read().then(({ done, value }) => {
            if (done) {
              observer.complete();
              return;
            }

            const chunk = decoder.decode(value);
            const lines = chunk.split('\n');

            lines.forEach(line => {
              if (line.startsWith('data: ')) {
                try {
                  const data = JSON.parse(line.substring(6));
                  if (data.error) {
                    observer.error(data.error);
                  } else if (data.done) {
                    observer.complete();
                  } else if (data.response) {
                    observer.next(data.response);
                  }
                } catch (e) {
                  // Ignore parsing errors for incomplete chunks
                }
              }
            });

            readStream();
          }).catch(error => {
            observer.error(error);
          });
        };

        readStream();
      })
      .catch(error => {
        observer.error(error);
      });
    });
  }

  checkHealth(): Observable<any> {
    return this.http.get(`${this.apiUrl}/health`);
  }
}