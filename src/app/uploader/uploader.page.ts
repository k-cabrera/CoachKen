import { Component, OnInit } from '@angular/core';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { finalize, tap } from 'rxjs/operators';
//import { Time } from '@angular/common';
import { Geolocation, Geoposition } from '@ionic-native/geolocation/ngx';
//import { getLocaleDateFormat } from '@angular/common';
//import { Data } from '@angular/router';
//import Timestamp = firestore.Timestamp;
//import { firestore } from 'firebase';
//import * as firebase from 'firebase';

export interface MyData {
  name: string;
  filepath: string;
  size: number;
  date: string;
  //blog: string;
  //latitude: number,
  //longitude: number
  //location: Geolocation
}

@Component({
  selector: 'app-uploader',
  templateUrl: './uploader.page.html',
  styleUrls: ['./uploader.page.scss'],
})



export class UploaderPage implements OnInit {

// Upload Task 
task: AngularFireUploadTask;

// Progress in percentage
percentage: Observable<number>;

// Snapshot of uploading file
snapshot: Observable<any>;

// Uploaded File URL
UploadedFileURL: Observable<string>;

//Uploaded Image List
images: Observable<MyData[]>;

//File details  
fileName:string;
fileSize:number;

//Status check 
isUploading:boolean;
isUploaded:boolean;

//location
latitude:number;
longitude:number;
date: string;
location: Geolocation;

private imageCollection: AngularFirestoreCollection<MyData>;
constructor(
  //public Timestamp (long seconds, int nanoseconds),
  private storage: AngularFireStorage, 
  private database: AngularFirestore,
  private geolocation: Geolocation
  ) {
  this.isUploading = false;
  this.isUploaded = false;
  //Set collection where our documents/ images info will save
  this.imageCollection = database.collection<MyData>('Posts');
  this.images = this.imageCollection.valueChanges();

  
}

ngOnInit(){
  
}
//getCoordinates() {
  //  this.geolocation.getCurrentPosition().then((resp) => {
    //   this.latitude= resp.coords.latitude;
      // this.longitude = resp.coords.latitude;
      
    //}).catch((error) => {
      //console.log('Error getting location', error);
   // });
  //}
  
uploadFile(event: FileList) {

  
  
  // The File object
  const file = event.item(0)

  //const blog = event.item(1)

  // Validation for Images Only
  if (file.type.split('/')[0] !== 'image') { 
   console.error('unsupported file type :( ')
   return;
  }

  this.isUploading = true;
  this.isUploaded = false;


  //this.date = firestore.Timestamp.now();
  this.fileName = file.name;

  // The storage path
  const path = `freakyStorage/${new Date().getTime()}_${file.name}`;

  // Totally optional metadata
  const customMetadata = { app: 'Freaky Image Upload Demo' };

  //File reference
  const fileRef = this.storage.ref(path);

  // The main task
  this.task = this.storage.upload(path, file, { customMetadata });

  //location
  
    this.geolocation.getCurrentPosition().then((resp) => {
       this.latitude= resp.coords.latitude;
       this.longitude = resp.coords.latitude;
      
    }).catch((error) => {
      console.log('Error getting location', error);
    });
  

  // Get file progress percentage
  this.percentage = this.task.percentageChanges();
  this.snapshot = this.task.snapshotChanges().pipe(
    
    finalize(() => {
      // Get uploaded file storage path
      this.UploadedFileURL = fileRef.getDownloadURL();
      
      this.UploadedFileURL.subscribe(resp=>{
        this.addImagetoDB({
          name: file.name,
          filepath: resp,
          size: this.fileSize,
          date: Date(),
         // blog: blog,
          //location: this.geolocation
          //latitude: this.latitude,
          //longitude: this.longitude
         // longitude: longitudeloc,
          //latitude: latitudeloc
        });
        this.isUploading = false;
        this.isUploaded = true;
      },error=>{
        console.error(error);
      })
    }),
    tap(snap => {
        this.fileSize = snap.totalBytes;
    })
  )
}

addImagetoDB(image: MyData) {
  //Create an ID for document
  const id = this.database.createId();

  //Set document id with value in database
  this.imageCollection.doc(id).set(image).then(resp => {
    console.log(resp);
  }).catch(error => {
    console.log("error " + error);
  });
}


}
  



