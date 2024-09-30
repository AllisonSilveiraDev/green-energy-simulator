import { Component } from '@angular/core';
import {
    ReactiveFormsModule,
    FormsModule,
    FormBuilder,
    FormGroup,
    Validators,
} from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableDataSource } from '@angular/material/table';
import { Device } from '../device.model';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [
        ReactiveFormsModule,
        FormsModule,
        MatTableModule,
        MatPaginatorModule,
        MatSortModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatIconModule,
    ],
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
})
export class AppComponent {
    title = 'green-energy-simulator';
    deviceForm: FormGroup;
    dataSource = new MatTableDataSource<Device>([]);
    tariff: number = 0;
    totalConsumption: number = 0;
    totalCost: number = 0;
    displayedColumns: string[] = [
        'name',
        'energyConsumption',
        'costPerMonth',
        'action',
    ];

    constructor(private fb: FormBuilder) {
        this.deviceForm = this.fb.group({
            name: ['', Validators.required],
            power: [0, [Validators.required, Validators.min(1)]],
            hoursPerDay: [0, [Validators.required, Validators.min(1)]],
        });
    }

    addDevice(): void {
        const formValues = this.deviceForm.value;
        const device: Device = {
            name: formValues.name,
            power: formValues.power,
            hoursPerDay: formValues.hoursPerDay,
            daysPerMonth: 30,
            energyConsumption:
                (formValues.power * formValues.hoursPerDay * 30) / 1000,
            costPerMonth: 0,
        };

        this.dataSource.data = [...this.dataSource.data, device];
        this.calculateTotals();
        this.deviceForm.reset();
    }

    removeDevice(device: Device): void {
        this.dataSource.data = this.dataSource.data.filter((d) => d !== device);
        this.calculateTotals();
    }

    updateTariff(tariff: number): void {
        let stringTariff = tariff.toString().replace(',', '.');
        let finalTariff = parseFloat(stringTariff);
        this.tariff = finalTariff;
        this.calculateTotals();
    }

    calculateTotals(): void {
        this.totalConsumption = 0;
        this.totalCost = 0;

        this.dataSource.data.forEach((device) => {
            device.costPerMonth = device.energyConsumption * this.tariff;
            this.totalConsumption += device.energyConsumption;
            this.totalCost += device.costPerMonth;
        });
    }
}
