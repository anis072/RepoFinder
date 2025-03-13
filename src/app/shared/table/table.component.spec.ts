import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableComponent } from './table.component';
interface MockData {
  id: number;
  name: string;
}
describe('TableComponent', () => {
  let component: TableComponent<MockData>;
  let fixture: ComponentFixture<TableComponent<MockData>>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TableComponent<MockData>);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
