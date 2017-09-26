var calendar = function () {

  var new_year = new Date().getFullYear();
  var new_month = new Date().getMonth() + 1;
  var c_date;

  function getYear() {
    return new_year;
  }

  function getMonth() {
    return new_month;
  }

  function getCal(new_year, new_month) { 
    c_date = [];
    console.log(new_year +", "+ new_month);

    var	d = new Date(new_year, new_month-1, 1),
        // 월별 일수 구하기
        d_length = 32 - new Date(new_year, new_month-1, 32).getDate(),
        year = d.getFullYear(),
        month = d.getMonth(),
        date = d.getDate(),
        day = d.getDay();

    console.log("new_year//" + new_year);
    console.log("new_month//" + new_month);
    console.log("date//" + date);
    console.log("day//" + day);

    // caption 영역 날짜 표시 객체
    // 테이블 초기화
    for (var i = 0; i < 44; i++) {
      c_date[i] = '&nbsp;';
    }
    
    // 한달치 날짜를 테이블에 시작 요일부터 순서대로 표시
    for (var i = day; i < day + d_length; i++) {
      c_date[i] = date;
      date++;
    }  
    return {
      year: year,
      month: month+1,
      c_date: c_date
    }
  }
  
  return {
    getCal: getCal,
    getYear: getYear,
    getMonth: getMonth
  };

};