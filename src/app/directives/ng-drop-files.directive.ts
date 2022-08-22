import { FileItem } from '../models/file-item';
import { Directive, EventEmitter, ElementRef, 
         HostListener, Input, Output } from '@angular/core';

@Directive({
  selector: '[appNgDropFiles]'
})
export class NgDropFilesDirective {

  constructor() { }

  @Input() archivos: FileItem[] = [];
  @Output() mouseSobre: EventEmitter<boolean> = new EventEmitter();

  @HostListener('dragover', ['$event'])
  public onDragEnter( event: any){
    this.mouseSobre.emit(true);
    this._prevenirDetener( event );
  }

  @HostListener('dragleave', ['$event'])
  public onDragLeave( event: any){
    this.mouseSobre.emit(false);
  }
  
  @HostListener('drop', ['$event'])
  public onDrop( event: any){
    this.mouseSobre.emit(false);
    let transferencia = this._getTransferencia(event);

    if(!transferencia){
      return;
    } else {
      this._extraerArchivos( transferencia.files );
      this._prevenirDetener( event );
      this.mouseSobre.emit(false);
    }

  }

  private _getTransferencia( event:any ){
    return event.dataTransfer ? event.dataTransfer : event.originalEvent.dataTransfer;
  }

  private _extraerArchivos( archivosLista: FileList ){
    for(let propiedad in Object.getOwnPropertyNames( archivosLista )){
      let archivoTemporal = archivosLista[propiedad]
      if(this._archivoPuedeSerCargado( archivoTemporal )){
        let nuevoArchivo = new FileItem( archivoTemporal );
        this.archivos.push( nuevoArchivo );
      }
    }
    console.log( this.archivos );
  }

  //Validaciones
  private _archivoPuedeSerCargado( archivo:File ){
    if( !this._archivoYaFueDroppeado( archivo.name ) && this._esImagen( archivo.type ) ){
      return true;
    } else {
      return false;
    }
  }

  private _prevenirDetener( event:Event ){
    event.preventDefault();
    event.stopPropagation();
  }

  private _archivoYaFueDroppeado( nombreArchivo:string ){
    for( let archivo of this.archivos ){
      if(archivo.nombreArchivo == nombreArchivo){
        console.log('el archivo ' + nombreArchivo + ' ya esta agregado');
        return true;
      }
    }
    return false;
  }

  private _esImagen( tipoArchivo:string ){
    return ( tipoArchivo=== '' || tipoArchivo === undefined ) ? false : tipoArchivo.startsWith('image');
  }


}
