import {Component, HostListener, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/forkJoin';
import * as _ from 'lodash';

import { GamificationService} from '../../service/gamification.service';
import { UserActivity } from '../../model/userActivity';
import { UserService } from '../../service/user.service';
import { User } from '../../model/user';
import { AllUsers } from '../../model/allUsers';

export enum KEY_CODE {
    UP_ARROW = 38,
    DOWN_ARROW = 40
}

@Component({
    selector: 'app-all-users-table',
    templateUrl: './all-users-table.component.html',
    styleUrls: ['./all-users-table.component.css'],
})

export class AllUsersTableComponent implements OnInit {
    title: string;
    userActivity: UserActivity[];
    users: User[];
    allUsers: AllUsers[];
    key: string;
    counter: number;
    selectedUser: UserActivity;
    selectedIndex: number;
    isViewTable: boolean;

    constructor(
        private gamificationService: GamificationService,
        private userService: UserService,
        private router: Router
    ) { }


    ngOnInit(): void {
        this.title = 'All Users Table';
        this.userActivity = [];
        this.users = [];
        this.allUsers = [];
        this.key = '';
        this.counter = 0;
        this.isViewTable = false;
        this.getData();
    }

    private getData(): void {
        const pointSumForAllUsers = this.gamificationService.getPointSumForAllUsers();
        const allUsers = this.userService.getAllUsers();
        Observable.forkJoin([pointSumForAllUsers, allUsers])
          .subscribe(
            (data: Array<any>) => {
                this.userActivity = data[0];
                this.users = data[1];
                this.compoundData();
            },
            (error: any) => {
                console.log(error);
            }
        );
    }

    compoundData(): void {
        const merged: Array<any> = _(this.users) // start sequence
            .keyBy('uuid') // create a dictionary of the 1st array
            .merge(_.keyBy(this.userActivity, 'to')) // create a dictionary of the 2nd array, and merge it to the 1st
            .values() // turn the combined dictionary to array
            .value();

        merged.forEach(element => {
            if (element.hasOwnProperty('name') && element.hasOwnProperty('point')) {
                this.allUsers.push(element);
            } else if (element.hasOwnProperty('name') && !element.hasOwnProperty('point')) {
                element.point = 0;
                element.to = '';
                this.allUsers.push(element);
            }
        });
        this.isViewTable = true;
    }

    @HostListener('window:keyup', ['$event'])
    keyEvent(event: KeyboardEvent): void {
        if (event.keyCode === KEY_CODE.UP_ARROW) {
            this.selectedUser = this.allUsers[--this.selectedIndex];
        } else
        if (event.keyCode === KEY_CODE.DOWN_ARROW) {
            this.selectedUser = this.allUsers[++this.selectedIndex];
        }
    }

    onSelect(user: AllUsers, i: number): void {
        this.selectedUser = user;
        this.selectedIndex = i;
    }

    setKey(tableHeader: string): void {
        this.counter === 2 ? this.counter = 0 : this.counter++;
        tableHeader === 'name' ? this.key = 'name' : this.key = 'point';
    }

    gotoDetail(uuid: string): void {
        this.router.navigate(['/user-details-table', uuid]);
    }
    setBackgroundColor(point: number): string {
      if (point >= 0 && point < 19) {
        return '#FFDAB9';
      } else if (point >= 20 && point < 30) {
        return '#F4A460';
      } else if (point >= 30 && point < 60) {
        return '#90EE90';
      } else if (point >= 60 && point < 90) {
        return '#ADD8E6';
      } else if (point >= 90 && point < 120) {
        return '#1E90FF';
      } else if (point >= 120 && point < 150) {
        return '#BC8F8F';
      } else if (point >= 150 && point < 180) {
        return '#8B008B';
      } else if (point >= 180 && point < 210) {
        return '#FFFF00';
      } else if (point >= 210 && point < 240) {
        return '#FFA500';
      } else if (point >= 240 && point < 270) {
        return '#FF0000';
      } else if (point >= 270 && point < 300) {
        return '#00FF00';
      } else if (point >= 300 && point < 330) {
        return '#00FFFF';
      } else if (point >= 330 && point < 360) {
        return '#0000FF';
      } else if (point >= 360 && point < 390) {
        return '#9932CC';
      } else if (point >= 390 && point < 420) {
        return '#000000';
      } else if (point >= 420) {
        return '#000000';
      }
    }
    setColor(point: number): string {
      if (point >= 0 && point < 90) {
        return '#000000';
      } else if (point >= 90 && point < 180) {
        return '#FFFFFF';
      } else if (point >= 180 && point < 240) {
        return '#000000';
      } else if (point >= 240 && point < 270) {
        return '#FFFF00';
      } else if (point >= 270 && point < 330) {
        return '#000000';
      } else if (point >= 330 && point < 390) {
        return '#F4A460';
      } else if (point >= 390 && point < 420) {
        return '#FF0000';
      } else if (point >= 420) {
        return '#FFA500';
      }
    }
}
