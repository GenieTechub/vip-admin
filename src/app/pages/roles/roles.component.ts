import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { TableModule } from 'primeng/table';
import { TreeNode } from 'primeng/api';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule } from 'primeng/floatlabel';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
interface Role {
  id: number;
  rolename: string;
  rolelevel: number;
  createddate: string;
}
@Component({
  selector: 'app-roles',
  imports: [CommonModule, TableModule, InputTextModule, InputTextModule, FloatLabelModule, FormsModule, DialogModule, ButtonModule],
  templateUrl: './roles.component.html',
  styleUrl: './roles.component.scss'
})
export class RolesComponent {

  visible: boolean = false;
  deleteRoleVisible: boolean = false;
  roles: Role[] = [
    { id: 1, rolename: 'Super Admin', rolelevel: 1, createddate: '2025-01-01' },
    { id: 2, rolename: 'Admin', rolelevel: 2, createddate: '2025-01-02' },
    { id: 3, rolename: 'Merchant', rolelevel: 3, createddate: '2025-01-03' },
    { id: 4, rolename: 'Finance Manager', rolelevel: 4, createddate: '2025-01-04' },
    { id: 5, rolename: 'Support', rolelevel: 5, createddate: '2025-01-05' },
    { id: 5, rolename: 'Shop', rolelevel: 6, createddate: '2025-01-05' },
    { id: 5, rolename: 'Market', rolelevel: 7, createddate: '2025-01-05' },
  ];

  showDialog(data: any) {
    this.visible = true;
  }

  deleteRole(data: any) {
    this.deleteRoleVisible = true;
  }

}
