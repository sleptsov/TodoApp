import { Injectable } from '@angular/core';

@Injectable()
export class LoaderService {

    isLoading: boolean = false;

    constructor() { }

    show(): void {
        this.isLoading = true;
    }

    hide(): void {
        this.isLoading = false;
    }
}
