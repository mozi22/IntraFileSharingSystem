import { Component, Input, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { Select2OptionData } from 'ng2-select2';

@Component({
  selector: 'filter-header',
  templateUrl: './filter-header.component.html',
  styleUrls: ['./filter-header.component.css'],
})


export class FilterHeaderComponent {
  @Input() exampleData: Array<Select2OptionData>;
  @Input() selectedCategory: string = "0";
  @Output() filterRecords: EventEmitter<string> = new EventEmitter<string>();
  @Output() searchTerm: EventEmitter<string> = new EventEmitter<string>();



}
