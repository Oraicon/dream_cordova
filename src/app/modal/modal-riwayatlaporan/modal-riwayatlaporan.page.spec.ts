import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ModalRiwayatlaporanPage } from './modal-riwayatlaporan.page';

describe('ModalRiwayatlaporanPage', () => {
  let component: ModalRiwayatlaporanPage;
  let fixture: ComponentFixture<ModalRiwayatlaporanPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalRiwayatlaporanPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ModalRiwayatlaporanPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
