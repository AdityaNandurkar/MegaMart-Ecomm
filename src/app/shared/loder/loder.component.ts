import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-loder',
  templateUrl: './loder.component.html',
  styleUrls: ['./loder.component.scss']
})
export class LoderComponent {
  @Input() isLoading: boolean = false;
}
