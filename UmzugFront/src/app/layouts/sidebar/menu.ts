import { MenuItem } from './menu.model';

export const MENU: MenuItem[] = [
  {
    id: 1,
    label: 'MENUITEMS.MENU.TEXT',
    isTitle: true
  },
  {
    id: 131,
    label: 'MENUITEMS.DASHBOARD.TEXT',
    icon: ' ri-dashboard-2-line',
    link: '/pages'
  },
  {
    id: 131,
    label: 'MENUITEMS.ELEMENTS.TEXT',
    icon: 'bx bx-dollar-circle',
    subItems: [
      {
        id: 85,
        label: 'MENUITEMS.ELEMENTS.LIST.LIST',
        link: 'element',
        parentId: 84
      },
      {
        id: 86,
        label: 'MENUITEMS.ELEMENTS.LIST.CREATE',
        link: 'element/add',
        parentId: 84,
      },
    ]
  },

  {
    id: 131,
    label: 'MENUITEMS.LARGE-ELEMENTS.TEXT',
    icon: 'bx bx-dollar-circle',
    subItems: [
      {
        id: 85,
        label: 'MENUITEMS.LARGE-ELEMENTS.LIST.LIST',
        link: 'largeElement',
        parentId: 84
      },
      {
        id: 86,
        label: 'MENUITEMS.LARGE-ELEMENTS.LIST.CREATE',
        link: 'largeElement/add',
        parentId: 84,
      },
    ]
  },


  {
    id: 131,
    label: 'MENUITEMS.KITCHENS.TEXT',
    icon: 'bx bx-dollar-circle',
    subItems: [
      {
        id: 85,
        label: 'MENUITEMS.KITCHENS.LIST.LIST',
        link: 'kitchen',
        parentId: 84
      },
      {
        id: 86,
        label: 'MENUITEMS.KITCHENS.LIST.CREATE',
        link: 'kitchen/add',
        parentId: 84,
      },
    ]
  },


  {
    id: 131,
    label: 'MENUITEMS.ROOMS.TEXT',
    icon: 'bx bx-dollar-circle',
    subItems: [
      {
        id: 85,
        label: 'MENUITEMS.ROOMS.LIST.LIST',
        link: 'room',
        parentId: 84
      },
      {
        id: 86,
        label: 'MENUITEMS.ROOMS.LIST.CREATE',
        link: 'room/add',
        parentId: 84,
      },
    ]
  },
 {
    id: 131,
    label: 'MENUITEMS.UMZUGS.TEXT',
    icon: 'bx bx-dollar-circle',
    subItems: [
      {
        id: 85,
        label: 'MENUITEMS.UMZUGS.LIST.LIST',
        link: 'umzug',
        parentId: 84
      },
      {
        id: 86,
        label: 'MENUITEMS.UMZUGS.LIST.CREATE',
        link: 'umzug/add',
        parentId: 84,
      },
    ]
  },

  {
    id: 131,
    label: 'MENUITEMS.MESSAGE-lANDING.TEXT',
    icon: 'ri-mail-send-line',
    link: 'messageLanding'
  },
  {
    id: 131,
    label: 'MENUITEMS.SETTINGS.TEXT',
    icon: ' ri-settings-3-fill',
    subItems: [
      {
        id: 85,
        label: 'MENUITEMS.SETTINGS.LIST.LIST-SETTINGS',
        link: 'settings',
        parentId: 84
      },
     

      {
        id: 86,
        label: 'MENUITEMS.SETTINGS.LIST.LIST-SERVICES',
        link: 'settings/services',
        parentId: 84,
      },
    ]
  },

];
export const adminMenu: MenuItem[] = [
  {
    id: 131,
    label: 'MENUITEMS.USERS.TEXT',
    icon: 'ri-user-6-line',
    subItems: [
      {
        id: 85,
        label: 'MENUITEMS.USERS.LIST.LIST',
        link: 'user',
        parentId: 84
      },
      {
        id: 86,
        label: 'MENUITEMS.USERS.LIST.CREATE',
        link: 'user/add',
        parentId: 84,
      },

    ]
  },
]
