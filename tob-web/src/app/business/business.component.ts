import { Component, OnInit, OnDestroy } from '@angular/core';
import { GeneralDataService } from 'app/general-data.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-business',
  templateUrl: './business.component.html',
  styleUrls: ['./business.component.scss']
})
export class BusinessComponent implements OnInit, OnDestroy {
  id: number;
  loaded: boolean;
  record: any;
  loc: any;
  dbas: any[];
  certs: any[];
  locations: any[];
  error: string;
  sub: any;

  constructor(
    private dataService: GeneralDataService,
    private route: ActivatedRoute) { }

  ngOnInit() {
    let loaded = this.dataService.preloadData(['verifiableclaimtypes', 'verifiableorgtypes', 'locationtypes']);
    this.sub = this.route.params.subscribe(params => {
      this.id = +params['recordId'];
      loaded.then(status => {
        this.dataService.loadVerifiedOrg(this.id).subscribe(record => {
          this.record = record;
          console.log('verified org:', record);
          this.loaded = !!record;
          if(! record) this.error = 'Record not found';
          else {
            let orgType = this.dataService.findOrgData('verifiableorgtypes', record.orgTypeId);
            this.record.type = orgType || {};
            this.record.typeName = orgType && orgType.description;

            let locs = [];
            if(Array.isArray(record.locations)) {
              for(var i = 0; i < record.locations.length; i++) {
                let loc = Object.assign({}, record.locations[i]);
                let locType = this.dataService.findOrgData('locationtypes', loc.locationTypeId);
                loc.type = locType || {};
                loc.typeName = locType && locType.locType;
                locs.push(loc);
              }
            }
            this.locations = locs;
            console.log('locations', locs);

            let dbas = [];
            if(Array.isArray(record.doingBusinessAs)) {
              for(var i = 0; i < record.doingBusinessAs.length; i++) {
                let dba = Object.assign({}, record.doingBusinessAs[i]);
                dbas.push(dba.DBA);
              }
            }
            this.dbas = dbas;
            console.log('dbas', dbas);

            let certs = [];
            if(Array.isArray(record.claims)) {
              let seen = {};
              for(var i = 0; i < record.claims.length; i++) {
                let cert = Object.assign({}, record.claims[i]);
                let grp = seen[cert.claimType];
                if(! grp) {
                  grp = seen[cert.claimType] = {others: []};
                  grp.type = this.dataService.findOrgData('verifiableclaimtypes', cert.claimType);
                  grp.typeName = grp.type ? grp.type.claimType : '';
                  grp.color = ['green', 'orange', 'blue', 'purple'][cert.claimType % 4];
                  grp.top = cert;
                  certs.push(grp);
                } else {
                  grp.others.push(cert);
                }
              }
              certs.sort((a,b) => a.typeName.localeCompare(b.typeName));
            }
            this.certs = certs;
            console.log('claims', certs);

            /*this.dataService.loadFromApi('verifiableorgs/' + this.id + '/voclaims')
              .subscribe((res: any) => {
                let certs = [];
                let seen = {};
                for(var i = 0; i < res.length; i++) {
                  let cert = res[i];
                  if(! seen[cert.voClaimType]) {
                    cert.type = this.dataService.findOrgData('verifiableclaimtypes', cert.voClaimType);
                    cert.color = ['green', 'orange', 'blue', 'purple'][cert.voClaimType % 4];
                    certs.push(cert);
                    seen[cert.voClaimType] = 1;
                  }
                }
                this.certs = certs;
                console.log('claims', res);
              });*/
          }
        }, err => {
          this.error = err;
        });
      });
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
