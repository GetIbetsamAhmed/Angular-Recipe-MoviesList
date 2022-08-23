import { Component, OnInit } from "@angular/core";
import { HttpHelperService, Movie } from "../http-helper.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

@Component({
  selector: "app-movie-list",
  templateUrl: "./movie-list.component.html",
  styleUrls: ["./movie-list.component.scss"],
})
export class MovieListComponent implements OnInit {
  formGroup: FormGroup;
  moviesArrList = <Movie[]>[];
  constructor(
    public httpHelper: HttpHelperService,
    private formBuilder: FormBuilder
  ) {
    this.formGroup = this.formBuilder.group({
      year: [
        "",
        Validators.compose([
          Validators.required,
          Validators.maxLength(4),
          Validators.minLength(4),
        ]),
      ],
    });
  }

  onSearchSubmit() {
    if (this.formGroup.valid) {
      this.httpHelper
        .getMoviesByYear(this.formGroup.value.year)
        .subscribe((res) => {
          this.moviesArrList = res.data;
        });
    }
  }

  ngOnInit() {}
}
