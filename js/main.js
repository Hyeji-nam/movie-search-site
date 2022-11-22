;(async () => {
  // 초기화 코드들
  const moviesEl = document.querySelector('.movies')
  const moviesLoading = document.querySelector('.loading')

  const moreBtnWrap = document.querySelector('.actions')
  const moreBtnEl = document.querySelector('.more')

  const inputEl = document.querySelector('.search-form')
  const searchBtn = document.querySelector('.search-btn')
  const typeOpt = document.querySelector('.type')
  const countOpt = document.querySelector('.count')
  const yearOpt = document.querySelector('.year')
  const yearOpts = document.querySelectorAll('.year option')

  const moviesNoResult = document.querySelector('.message')
  const moviesWrap = document.querySelector('.movies-list')

  

  let page = 1
  let searchText = ""
  let year = ""
  let yearVal = yearOpts.value
  let typeVal = typeOpt.value

  // 최초 호출!
  const movies = await getMovies()
  page += 1
  renderMovies(movies)


  // 검색 시 영화 목록 가져오기
  searchBtn.addEventListener('click', async (event) => {
    renderSearchList(event)
  })
  inputEl.addEventListener('keydown', async (event) => {
    if (event.key === 'Enter') {
      renderSearchList(event)
    }
  })
  async function renderSearchList(event) {
    moviesLoading.classList.add('show')
    moviesNoResult.classList.add('hidden')

    event.preventDefault()
    searchText = inputEl.value
    
    moviesEl.innerHTML = ""
    page = 1;
    const year = yearOpt.value
    countVal = countOpt.value
    typeVal = typeOpt.value

    if (searchText) {
      moreBtnWrap.classList.add('hidden')

      const movies = await getMovies(searchText, typeVal, year, page)
      renderMovies(movies)
      for (let i = 1; i < countVal; i++) {
        pageCount()
      }
      
    } else if (searchText === "") {
      alert('검색 결과가 없습니다.')
      moviesWrap.classList.add('no-result')
      moreBtnWrap.classList.add('hidden')
      moviesNoResult.classList.remove('hidden')
      moviesLoading.classList.remove('show')
    }
  }
  
  // 더보기 버튼 클릭
  moreBtnEl.addEventListener('click', async () => {
    pageCount()
  })

  // 개봉연도 검색
  for (let i = 2022; i >= 1980; i--) {
    const yearOpts = document.createElement('option')
    yearOpts.value = i
    yearOpts.textContent = i
    yearOpt.append(yearOpts)
  }
  if (yearVal === year) {
    const movies = await getMovies(searchText, typeVal, yearVal, page)
    renderMovies(movies)
  }

// 페이지 더 불러오기
async function pageCount() {
  page += 1
  const year = yearOpt.value
  typeVal = typeOpt.value

  const movies = await getMovies(searchText, typeVal, year, page)
  renderMovies(movies)
}

async function getMovies(search = "", type = "", year = "", page = 1) {
  const url = `https://omdbapi.com/?apikey=7035c60c&s=${search}&type=${type}&y=${year}&page=${page}`
  const res = await fetch(url)
  const { Search: movies, totalResults } = await res.json()
  return movies
}

// 영화 목록 가져오기
function renderMovies(movies) {

  if (!movies) {
    moreBtnEl.classList.add('hidden')
    return
  }

  moreBtnWrap.classList.add('hidden')
  moviesEl.classList.remove('hidden')

  for (const movie of movies) {
    const movieEl = document.createElement('div')
    movieEl.classList.add('movie')
    const h1El = document.createElement('h1')
      h1El.textContent = movie.Title
      h1El.addEventListener('click', () => {
        console.log(movie.Title)
      })
      const imgEl = document.createElement('img')
      imgEl.src = movie.Poster
      movieEl.append(h1El, imgEl)
    moviesEl.append(movieEl)
  }

  moreBtnEl.classList.remove('hidden')
  moviesLoading.classList.remove('show')
}
})()
