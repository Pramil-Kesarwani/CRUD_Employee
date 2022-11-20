import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ApiService } from '../service/api.service';
import { EmployeeModel } from './employee-dashboard.model';

@Component({
  selector: 'app-employee-dashboard',
  templateUrl: './employee-dashboard.component.html',
  styleUrls: ['./employee-dashboard.component.css']
})
export class EmployeeDashboardComponent implements OnInit {

  formValue !: FormGroup;

  // creating instance of Employee Model Object to post our data.
  EmployeeModelObj: EmployeeModel = new EmployeeModel();
  employeeData !: any;
  anEmployeeData !: any;
  employeeId !:number;
  showAdd !: boolean;
  showUpdate !: boolean;

  constructor(private formBuilder:FormBuilder,private apiService:ApiService) { }

  ngOnInit(): void {
    this.formValue = this.formBuilder.group({
      firstName: [''],
      lastName: [''],
      email: [''],
      mobile: [''],
      salary : [''] 
    })

    this.getAllEmployees();
  }

  postEmployeeDetails() {
    this.EmployeeModelObj.firstName = this.formValue.value.firstName;
    this.EmployeeModelObj.lastName = this.formValue.value.lastName;
    this.EmployeeModelObj.email = this.formValue.value.email;
    this.EmployeeModelObj.mobile = this.formValue.value.mobile;
    this.EmployeeModelObj.salary = this.formValue.value.salary;

    this.apiService.postEmployee(this.EmployeeModelObj).subscribe({
      next: data => {
        console.log(data);
        alert('Employee Added Successfully')
        let ref = document.getElementById('cancel')
        ref?.click()
        this.formValue.reset();
        this.getAllEmployees();
      },
      error: err => {
        console.log(err);
        alert('Something went Wrong');
      }
    })
    
  }

  getAllEmployees() {
    this.apiService.getEmployee().subscribe({
      next: data => {
        this.employeeData = data;
      },
      error: err => {
        console.log(err);
        
      }
    })
  }

  deleteEmployee(data:any) {
    this.apiService.deleteEmployee(data.id).subscribe({
      next: data => {
        console.log(data);
        alert('Employee Deleted Successfully')
        this.getAllEmployees();
      },
      error: err => {
        console.log(err);
        alert('Something Went Wrong');
      }
    })
  }

  editEmployee(data:any) {

  // 1st way of getting data from an api and then attach one employee data to form fields
    // this.apiService.getAnEmployee(data.id).subscribe({
    //   next: data => {
    //     console.log(data);
    //     this.anEmployeeData = data;
    //     this.formValue = this.formBuilder.group({
    //       firstName: [this.anEmployeeData.firstName],
    //       lastName: [this.anEmployeeData.lastName],
    //       email: [this.anEmployeeData.email],
    //       mobile: [this.anEmployeeData.mobile],
    //       salary: [this.anEmployeeData.salary],
    //     });
    //   },
    //   error: err => {
    //     console.log(err);
    //   }
    // })

  // 2nd way of getting data and set values to form fields
    this.showAdd = false;
    this.showUpdate = true;
    this.employeeId = data.id;
    this.formValue.controls['firstName'].setValue(data.firstName);
    this.formValue.controls['lastName'].setValue(data.lastName);
    this.formValue.controls['email'].setValue(data.email);
    this.formValue.controls['mobile'].setValue(data.mobile);
    this.formValue.controls['salary'].setValue(data.salary);

    console.log(this.formValue.value);
  }

  updateEmployeeDetails() {
    this.EmployeeModelObj.firstName = this.formValue.value.firstName;
    this.EmployeeModelObj.lastName = this.formValue.value.lastName;
    this.EmployeeModelObj.email = this.formValue.value.email;
    this.EmployeeModelObj.mobile = this.formValue.value.mobile;
    this.EmployeeModelObj.salary = this.formValue.value.salary;

    this.apiService.updateEmployee(this.EmployeeModelObj, this.employeeId).subscribe({
      next: data => {
        console.log(data);
        alert('Employee Updated Successfully')
        this.formValue.reset();
        document.getElementById('cancel')?.click();
        this.getAllEmployees()
      },
      error: err => {
        console.log(err);
        
      }
    })
  }

  addEmployee() {
    this.formValue.reset();
    this.showAdd = true;
    this.showUpdate = false;
  }


}
