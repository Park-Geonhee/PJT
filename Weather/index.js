async function setRenderBackground(){
    // body의 background 주소를 넣어도 OK

    // 일부러 axios 요청으로 이미지를 받아오기
    
    // blob -> 이미지, 사운드, 비디오 등 멀티미디어 데이터를 다룰 때 사용
    const result = await axios.get("https://picsum.photos/1280/720", {
        responseType : "blob"
    });
    // console.log(result.data);
    // URL.createObjectURL -> 임시 URL을 만든다(페이지 내에서만 유효)
    // 받아온 데이터를 임시 URL을 만들어서 그 URL에 body에 넣는다
    const imageURL = URL.createObjectURL(result.data);
    document.querySelector('body').style.backgroundImage = `url(${imageURL})`;
}

// 화살표 함수로 쓰기
// const setRenderBackground = async () =>{}
const now = new Date();
const nowHour = now.getHours();
//시간 갱신하기
function setTime(){
    const timer = document.querySelector('.timer');

    setInterval(()=>{
        // date 함수
        const date = new Date();
        // console.log(date);

        // console.log(String(date.getSeconds()).padStart(2,'0'));
        // console.log(date.getMinutes());
        
        // timer.textContent = `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
        
        let nowHours = String(date.getHours()).padStart(2,'0');
        let nowMinutes = String(date.getMinutes()).padStart(2,'0');
        let nowSeconds = String(date.getSeconds()).padStart(2,'0');
        
        timer.textContent = `${nowHours}:${nowMinutes}:${nowSeconds}`;


        // 지금 시간에 따라 안내문구 바꾸기
         const timer_content = document.querySelector('.timer-content');
        if(date.getHours() < 12){
            timer_content.textContent = "Good Morning, Park!";
        }
        else if(date.getHours() < 18){
            timer_content.textContent = "Good Afternoon, Park!";
        }
        else{   
            timer_content.textContent = "Good Evening, Park!";
        }
            
    },1000)
    
}

function getMemo(){
    // localStorage로부터 가져와서 memo에 넣어주는 작업
    const memo = document.querySelector('.memo');
    memo.textContent = localStorage.getItem('todo');

}


function setMemo(){
    const memoInput = document.querySelector('.memo-input');
    memoInput.addEventListener('keyup',function(e){
        // e.code 입력 시 작성한 키보드 조회
        // console.log(e.code);
        // console.log(e.target);
        // console.log(e.target.value);
        //e.code 가 Enter면서 입력값이 존재할 경우
        if(e.code==='Enter' && e.target.value)
        {
            // 메모를 저장
            // const memo = document.querySelector('.memo');
            // memo.textContent = e.target.value;
            // // memoInput.value= "";

            // 메모가 날아가지 않도록 저장
            // 원래 방식 : 백엔드 DB에 저장하고, 가져와야 함
            // 브라우저에도 간단한 저장소 개념이 있음
            // localStorage
            // localStorage 사용법
            // localStorage.setItem('키','넣을값')
            localStorage.setItem('todo',e.target.value);
            // localStorage.getItem('키') -> 값을 가져온다
            
            // getMemo로 분리
            getMemo();
            e.target.value = "";
        }
    })
}

function deleteMemo(){
    // 이벤트 위임
    // document.querySelector('body')

    // 똑같은 함수를 수십만개에 addEventListener 가정-> 속도 저하
    // 이벤트 위임 활용
    document.addEventListener('click',function(e){
        // console.log(e.target);
        // 활용 예시
        // e.target.ClassList가 hello인 엘레먼트에 모두 이벤트 실행 가능

        // localStorge 지우기
        if(e.target.classList.contains('memo'))
        {
            localStorage.removeItem('todo');
            
            getMemo();
        }
        // HTML 파트 지우기
    })
    
}


function getPosition(options){

    // navigator.geolocation -> 일반 callback 함수(Promise X)
    // 프라미스화
    return new Promise((resolve, reject)=> {
        navigator.geolocation.getCurrentPosition(resolve,reject, options);
    })
}

async function getWeather(latitude, longitude){
    // 위도, 경도가 존재할 경우 
    const API_KEY =  "f00e91205d52319986be0fce70c31dbc";
    if(latitude && longitude)
    {// 날씨 API (위도, 경도 있는 ver)
        const URL = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${API_KEY}`;
        const result = await axios.get(URL);
        // console.log(result);
        return result;
    }   
    // 위도, 경도가 빈 문자열인 경우
    else
    {// 날씨 API (위도, 경도 없는 ver)
        const city_name = 'Seoul';
        const URL = `https://api.openweathermap.org/data/2.5/forecast?q=${city_name}&appid=${API_KEY}`
        const result = await axios.get(URL);
        console.log(result);
        return result;
    }
}

async function renderWeather(){
    //renderWeather에서 getPosition을 호출해서 위도, 경도를 받아온다
    let latitude = '';
    let longitude = '';
    
    // 위도, 경도가 있는 경우
    try{
        // getPosition().then(li=>{console.log(li)}).catch(error=>console.log(error));

        const position = await getPosition();
        // console.log(position);
        latitude = position.coords.latitude;
        longitude = position.coords.longitude;
        // console.log(latitude,longitude);
    }
    // 위도, 경도가 없는 경우
    catch(error){
        console.log(error);
    }
    console.log(latitude,longitude);
    
    // 날씨 요청 ~ 위도, 경도를 인자로 전달
    const weatherResponse = await getWeather(latitude, longitude);
    console.log(weatherResponse);

    // 요청받은 날씨의 정보들을 찾는다
    /*
    // 도시정보는 위도,경도가 값이 존재할 때만
    data
        city
            country:"KR"
            name:"Jamwon-dong"
        list[40]
            dt_txt : "2023-02-10 06:00:00"
            main
                temp : 279
            weather[0]
                main : "Clear"

    */
//    console.log(nowHour);
   // 지금 시간에 맞는 날씨정보 찾기
   let nowIdx;
   if(nowHour < 3){ nowIdx = 5;}
   else if(nowHour < 6){ nowIdx = 6;}
   else if(nowHour < 9){ nowIdx = 7;}
   else if(nowHour < 12){ nowIdx = 0;}
   else if(nowHour < 15){ nowIdx = 1;}
   else if(nowHour < 18){ nowIdx = 2;}
   else if(nowHour < 24){ nowIdx = 3;}
   else { nowIdx = 4;}
    
   // 현재 정보 불러오고, 넣어줄 HTML text 만들기
   let inputHTML = "";
   for(let i=0; i<5; i++)
   {
    const datas = weatherResponse.data.list[nowIdx+i];
    const dt = datas.dt_txt;
    const temp = (datas.main.temp -273.15).toFixed(1);
    const weather = datas.weather[0].main;
    console.log(dt,temp,weather);
    // 2023-02-10 15:00:00 2.7 Clear

    // 뿌려줄 텍스트1
    /*
    dt는 문자열 메소드 사용, 시각만 떼어 온다
    path 는 1.날씨명칭 2.현재시각 기준으로 이미지 선정
    temp는 현재 온도 + °C 
    */
    let path;
    const dt_parsed = dt.split(" ")[1].split(":")[0];
    console.log(dt_parsed)
    const dt_int = Number(dt_parsed)
    console.log(dt_int)
    if(dt_int>=18 || dt_int<=6)
    {
        if(weather === 'Clear') path = "./images/022-night-3.png";
        if(weather === 'Clouds') path = "./images/002-cloud-1.png";
    }
    else
    {
        if(weather === 'Clear') path = "./images/039-sun.png";
        if(weather === 'Clouds') path = "./images/001-cloud.png";
    }
    inputHTML +=`
    <div class="card-box flex-grow-1 ">
                        <p class="cart-text">${dt_parsed}시</p>
                        <h5 class="card-title">                            
                            <img src=${path} alt="weather"
                            width="80px" height="80px">    
                        </h5>
                        <p class="card-text">${temp}°C, ${weather}</p>
                    </div>`
    // 현재 날씨는 모달버튼 아이콘으로 지정해준다.
    if(i===0)
    {
        document.querySelector('.modal-button').style.cssText = `background-image : url(${path});`;
    }
   }
   document.querySelector('.card-body').insertAdjacentHTML('beforeend',inputHTML);
      // 뿌려줄 텍스트2
   
      const country = weatherResponse.data.city.country
      const city = weatherResponse.data.city.name
      const card_header = document.createElement('h3');
      card_header.textContent = `${city}, ${country}`;
      document.querySelector('.card-header').append(card_header);
     
}

async function allRender(){
    setRenderBackground();    
    // 설정한 시간(ms)마다 해당 콜백함수 반복
    setInterval(()=>{
        setRenderBackground();
    },5000)
}
allRender();
setTime();
setMemo();
getMemo();

deleteMemo();
renderWeather();

// https://picsum.photos/200/300
