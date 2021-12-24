import { Component, OnInit } from '@angular/core';
import { TreeNode } from 'primeng/api';


@Component({
  selector: 'app-user-organization-chart',
  templateUrl: './user-organization-chart.component.html',
  styleUrls: ['./user-organization-chart.component.css']
})
export class UserOrganizationChartComponent implements OnInit {
  data: TreeNode[];
  constructor() { }

  ngOnInit(): void {
      this.data = [{
        expanded: true,
        label: 'User Group',
        children: [
          {
            label: 'Role 1',
            expanded: true,
            children: [
              {
                expanded: true,
                label: 'PermissionSet 2',
                children: [
                  {
                    expanded: true,
                    label: 'Permission 1'
                  },
                  {
                    expanded: true,
                    label: 'Permission 2'
                  }
                ]
              },
              {
                expanded: true,
                label: 'RoomSet 2'
              }
            ]
          },

          {
            label: 'Role 2',
            expanded: true,
            children: [
              {
                expanded: true,
                label: 'PermissionSet 3'
              },
              {
                expanded: true,
                label: 'RoomSet 3'
              }
            ]
          },

        ]
      }];
  }

}
