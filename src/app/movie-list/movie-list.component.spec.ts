import {async, ComponentFixture, getTestBed, TestBed} from '@angular/core/testing';
import {MovieListComponent} from './movie-list.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ChangeDetectionStrategy, CUSTOM_ELEMENTS_SCHEMA, Type} from '@angular/core';
import {HttpClientTestingModule, HttpTestingController} from "@angular/common/http/testing";

describe('MovieListComponent', () => {
  let component: MovieListComponent;
  let fixture: ComponentFixture<MovieListComponent>;
  let input;
  let searchBtn;
  let compiled;
  let injector: TestBed;
  let httpMock: HttpTestingController;

  const pushValue = async (value) => {
    input.value = value;
    input.dispatchEvent(new Event('change'));
    input.dispatchEvent(new Event('input'));
    searchBtn.click();
    await fixture.whenStable();
  };

  const getByTestId = (testId: string) => {
    return compiled.querySelector(`[data-test-id="${testId}"]`);
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule, HttpClientTestingModule],
      declarations: [MovieListComponent],
      schemas : [CUSTOM_ELEMENTS_SCHEMA]
    })
      .overrideComponent(MovieListComponent, {
        set: {changeDetection: ChangeDetectionStrategy.Default}
      })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MovieListComponent);
    component = fixture.componentInstance;
    compiled = fixture.debugElement.nativeElement;
    injector = getTestBed();
    httpMock = fixture.debugElement.injector.get<HttpTestingController>(HttpTestingController as Type<HttpTestingController>);
    input = getByTestId('app-input');
    searchBtn = getByTestId('submit-button');
    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('Should render the Initial UI', async () => {
    expect(input.value.trim()).toBeFalsy();
    expect(searchBtn.innerHTML).toBe('Search');
    expect(getByTestId('no-result')).toBeNull();
    expect(getByTestId('movieList')).toBeNull();
  });

  it('Should show No Results Found when there are no results from API', async (done) => {
    await pushValue('1996');
    await fixture.whenStable();

    const url = 'https://jsonmock.hackerrank.com/api/movies?Year=1996';
    let req = httpMock.expectOne(url);
    req.flush({page: 1, per_page: 10, total: 0, total_pages: 0, data: []});
    expect(req.request.url).toBe(url);

    await fixture.detectChanges();
    await fixture.whenStable();

    expect(getByTestId('movieList')).toBeNull();
    expect(getByTestId('no-result')).toBeTruthy();
    expect(getByTestId('no-result').innerHTML.trim()).toEqual('No Results Found');
    done();
  });

  it('Should search and render the movies - 1', async (done) => {
    await pushValue('2015');
    await fixture.whenStable();

    const url = 'https://jsonmock.hackerrank.com/api/movies?Year=2015';
    let req = httpMock.expectOne(url);
    req.flush({
      page: 1,
      per_page: 10,
      total: 0,
      total_pages: 0,
      data: [{
        Title: 'The Death of Spiderman',
        Year: 2015,
        imdbID: 'tt5921428'
      }, {Title: 'Beat Feet: Scotty Smileys Blind Journey to Ironman', Year: 2015, imdbID: 'tt5117146'}]
    });
    expect(req.request.url).toBe(url);

    await fixture.detectChanges();
    await fixture.whenStable();

    const movieList = getByTestId('movieList');
    expect(movieList.children.length).toEqual(2);
    expect(movieList.children[0].innerHTML.trim()).toEqual('The Death of Spiderman');
    expect(movieList.children[1].innerHTML.trim()).toEqual('Beat Feet: Scotty Smileys Blind Journey to Ironman');
    expect(getByTestId('no-result')).toBeNull();
    done();
  });

  it('Should search and render the movies - 2', async (done) => {
    await pushValue('2010');
    await fixture.whenStable();

    const url = 'https://jsonmock.hackerrank.com/api/movies?Year=2010';
    let req = httpMock.expectOne(url);
    req.flush({
      page: 1,
      per_page: 10,
      total: 0,
      total_pages: 0,
      data: [{
        Title: 'A Mind Devoid of Happiness or: The Maze',
        Year: 2010,
        imdbID: 'tt5037380'
      }, {
        Title: 'Lard and the Peace Maze',
        Year: 2010,
        imdbID: 'tt5046522'
      }, {
        Title: 'Macau Stories III: City Maze',
        Year: 2010,
        imdbID: 'tt5603106'
      }, {Title: 'Harry Price: Ghost Hunter', Year: 2010, imdbID: 'tt4974584'}, {
        Title: 'Harry Snowman',
        Year: 2010,
        imdbID: 'tt2898306'
      }]
    });
    expect(req.request.url).toBe(url);

    await fixture.detectChanges();
    await fixture.whenStable();

    const movieList = getByTestId('movieList');
    expect(movieList.children.length).toEqual(5);
    expect(movieList.children[0].innerHTML.trim()).toEqual('A Mind Devoid of Happiness or: The Maze');
    expect(movieList.children[1].innerHTML.trim()).toEqual('Lard and the Peace Maze');
    expect(movieList.children[2].innerHTML.trim()).toEqual('Macau Stories III: City Maze');
    expect(movieList.children[3].innerHTML.trim()).toEqual('Harry Price: Ghost Hunter');
    expect(movieList.children[4].innerHTML.trim()).toEqual('Harry Snowman');
    expect(getByTestId('no-result')).toBeNull();
    done();
  });
});
