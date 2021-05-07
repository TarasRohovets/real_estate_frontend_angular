import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from 'src/app/core/authentication/auth.service';
import { ListingService } from '../../../core/services/api/listing.service';
import { ImageService } from '../../../core/services/api/image.service';
import { Subscription } from 'rxjs/internal/Subscription';
import { OperationType } from '../../../shared/models/listing/operation-type';
import { PropertyType } from 'src/app/shared/models/listing/property-type';
import { AppContextService } from 'src/app/core/services/app-context.service';
import { SellHouse } from '../../../shared/models/listing/sell-house';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-add-listing-sell',
  templateUrl: './add-listing-sell.component.html',
  styleUrls: ['./add-listing-sell.component.scss']
})
export class AddListingSellComponent implements OnInit, OnDestroy {

  private readonly TYPE = 'Sell';
  public title = "Sell your apartment";

  // typology: string[] = ["T0", "T1", "T2", "T3"];
  // bathrooms: number[] = [1, 2, 3, 4, 5];
  // floors: number[] = [1, 2, 3, 4, 5];
  // energyCertificate: string[] = ["A", "B", "C", "D"];
  // countries: string[] = ["Italy", "Ukraine", "Portugal"];
  // thumbnails = [];

  sellHouseForm: SellHouse;
  operationTypes: OperationType[];
  currentOperationType: OperationType;
  propertyTypes: PropertyType[];

  userId: number; // input

  subscriptions: Subscription = new Subscription();

  constructor(
    private authService: AuthService,
    private listingService: ListingService,
    private imageService: ImageService,
    private appContext: AppContextService) { }

  ngOnInit(): void {
    this.subscriptions.add(
      this.listingService.getOperationTypes().subscribe((result) => {

        if (result.IsValid) {
          this.operationTypes = result.Data;
          this.currentOperationType = this.operationTypes.find(x => x.Type === this.TYPE);
        }
      }));

    this.subscriptions.add(
      this.listingService.getPropertyTypes().subscribe((result) => {
        if (result.IsValid) {
          this.propertyTypes = result.Data;
        }
      }));

    this.sellHouseForm = new SellHouse();
    this.userId = this.appContext.getUserId();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  async publishListing(sellHouseForm: SellHouse) {
    // Check if logged in. If yes, POST
    const isAuthnticated = this.authService.isAuthenticated();
    if (isAuthnticated) {
      console.log("i am logged in");
      sellHouseForm.UserId = this.userId;
      sellHouseForm.OperationTypeId = this.currentOperationType.Id;
      console.log(this.sellHouseForm);
      console.log("sending photos");
          this.imageService.AddPropertyPhoto(sellHouseForm.photos, 1).subscribe()
      // this.listingService.listSellHouse(sellHouseForm).subscribe(res => {
      //   console.log(res);
      //   if (res.IsValid) {
      //     console.log("sending photos");
      //     this.imageService.AddPropertyPhoto(sellHouseForm.photos, res.Data).subscribe();
      //   }
      // });
    }
    if (!isAuthnticated) {

    }
    // If not cache the request, then update
  }

}
