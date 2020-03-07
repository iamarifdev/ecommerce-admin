import { NavItem } from '../models/nav-item.model';

export class NavigationList {
  static get items(): NavItem[] {
    return [
      {
        displayName: 'Dashboard',
        iconName: 'dashboard',
        route: '',
        children: [
          {
            displayName: 'Dashboard',
            iconName: 'dashboard',
            route: 'dashboard'
          },
          {
            displayName: 'Login Message',
            iconName: 'dashboard',
            route: 'dashboard/login-message'
          },
          {
            displayName: 'Online Users (All)',
            iconName: 'dashboard',
            route: 'dashboard/online-users/all'
          },
          {
            displayName: 'Users by Interface',
            iconName: 'dashboard',
            route: 'dashboard/users/interface/:interface'
          },
          {
            displayName: 'Radius Status',
            iconName: 'dashboard',
            route: 'dashboard/radius/status'
          },
          {
            displayName: 'Online Users',
            iconName: 'dashboard',
            route: 'dashboard/online-users'
          }
        ]
      },
      {
        displayName: 'Roles',
        iconName: 'group',
        route: 'roles'
      },
      {
        displayName: 'Users',
        iconName: 'group',
        route: '',
        children: [
          {
            displayName: 'List User',
            iconName: 'people',
            route: 'users'
          },
          {
            displayName: 'User Activity Log',
            iconName: 'notes',
            route: 'users/activity-log'
          },
          {
            displayName: 'User Schedule Job',
            iconName: 'replay',
            route: 'users/schedule-job'
          }
        ]
      },
      {
        displayName: 'System Configuration',
        iconName: 'settings_applications',
        route: 'configuration',
        children: [
          {
            displayName: 'Organization',
            iconName: 'account_balance',
            route: 'configuration/organization'
          }
        ]
      }
    ];
  }
}
