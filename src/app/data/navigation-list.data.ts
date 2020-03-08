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
          }
        ]
      },
      {
        displayName: 'Roles',
        iconName: 'group',
        route: 'roles'
      },
      {
        displayName: 'Products',
        iconName: 'format_list_bulleted',
        route: 'products'
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
