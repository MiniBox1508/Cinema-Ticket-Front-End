//Khai báo biến
let left_btn = document.getElementsByClassName('bi-chevron-left')[0];      //Nút trái 
let right_btn = document.getElementsByClassName('bi-chevron-right')[0];    //Nút phải để cuộn danh sách thẻ phim*/
let cards = document.getElementsByClassName('cards')[0];                   //Danh sách thẻ phim
let search = document.getElementsByClassName('search')[0];                 //Khu vực hiện kết quả tìm kiếm  
let search_input  = document.getElementById('search_input');               //Ô nhập liệu tìm kiếm

// Gán sự kiện cuộn chỉ khi các nút tồn tại
if (left_btn) {
    left_btn.addEventListener('click', () => {
        cards.scrollLeft -= 140;
    });
}
if (right_btn) {
    right_btn.addEventListener('click', () => {
        cards.scrollLeft += 140;
    });
}

/*Khi nhấp vào nút điều hướng trái hoặc phải, sẽ cuộn danh sách thẻ phim theo hướng tương ứng 140 pixel
left_btn.addEventListener('click',()=>{
     cards.scrollLeft -= 140;
})
right_btn.addEventListener('click',()=>{
    cards.scrollLeft += 140;
})

*/
//Tải và hiển thị dữ liệu từ file JSON
let json_url = "movie.json";
fetch(json_url).then(Response => Response.json())
//fetch(json_url): Gửi yêu cầu HTTP để lấy file movie.json
//Response.json(): Chuyển đổi dữ liệu JSON thành đối tượng JavaScript

//Hiển thị dữ liệu phim trong danh sách thẻ phim
.then((data) => {  //then((data) => {...}): Xử lý dữ liệu JSON sau khi tải thành công
    data.forEach((ele,i)=>{
        let {name, imdb, date, sposter, bposter, genre, type, url} = ele;       //Sử dụng destructuring để lấy các thuộc tính từ đối tượng phim 
        let card = document.createElement('a');      //Tạo 1 thẻ <a> mới cho mỗi bộ phim để chứa thông tin phim 
        card.classList.add('card');       //Tạo phần tử <a> mới và thêm lớp 'card' để áp dụng kiểu dáng CSS                  
        card.href = url;        //Thêm thuộc tính href để link đến url của phim      
        card.innerHTML = `
                    <img src="${sposter}" alt="${name}" class="poster">           
                    <div class="rest_card">           
                        <img src="${bposter}" alt="">           
                        <div class="cont">            
                            <h4>${name}</h4>         
                            <div class="sub">
                                <p>${genre}, ${date}</p>        
                                <p>${type}</p>        
                                <h3><span>IMDB </span><i class="bi bi-star-fill"></i> ${imdb}</h3>
                            </div>
                        </div>
                    </div> 
        `
        //Hiển thị khi hover (di chuột vào) thẻ phim (class 'rest_card') 
        //Ảnh áp phích lớn ('bposter') 
        //Class 'cont' chứa các thông tin phim
        //Tên phim 
        //Thể loại và ngày phát hành phim
        //Loại phim (ví dụ: Phim lẻ, Phim bộ)
        //Đánh giá IMDB của phim
        cards.appendChild(card);     //Thêm thẻ phim vào danh sách thẻ phim (class'cards')
    });


    //document.getElementsByClassName('title').innerText = data[0].name;        //Gán tên phim đầu tiên (data[0].name) vào tiêu đề trang (class 'title')
    //document.getElementById('gen').innerHTML = data[0].genre;         //Gán thể loại phim đầu tiên (data[0].genre) vào phần tử có id 'gen'    
    //document.getElementById('date').innerHTML = data[0].date         //Gán ngày phát hành phim đầu tiên (data[0].date) vào phần tử có id 'date'
    //document.getElementById('rate').innerHTML = `<span>IDMB </span><i class="bi bi-star-fill"></i> ${data[0].imdb}`;
    //Gán đánh giá IMDB của phim đầu tiên (data[0].imdb) vào phần tử có id 'rate'

        const titleElement = document.getElementsByClassName('title')[0];
        const genElement = document.getElementById('gen');
        const dateElement = document.getElementById('date');
        const rateElement = document.getElementById('rate');

        if (titleElement) {
            titleElement.innerText = data[0].name;
        }
        if (genElement) {
            genElement.innerHTML = data[0].genre;
        }
        if (dateElement) {
            dateElement.innerHTML = data[0].date;
        }
        if (rateElement) {
            rateElement.innerHTML = `<span>IMDB </span><i class="bi bi-star-fill"></i> ${data[0].imdb}`;
        }    

//Hiển thị kết quả tìm kiếm trên thanh tìm kiếm
    data.forEach(element =>{         //Duyệt qua từng phần tử trong mảng dữ liệu phim
        let { name , imdb, date, sposter, genre, url} =  element;         //Sử dụng destructuring để lấy các thuộc tính từ đối tượng phim
        let card = document.createElement('a');         //Tạo 1 thẻ <a> trong phần tìm kiếm cho mỗi bộ phim để chứa thông tin phim
        card.classList.add('card');         //Tạo phần tử <a> mới và thêm lớp 'card' để áp dụng kiểu dáng CSS
        card.href = url;         //Thêm thuộc tính href để link đến url của phim
        card.innerHTML = ` 
                <img src="${sposter}" alt="">
                <div class="cont">
                    <h3>${name} </h3>
                    <p>${genre}, ${date}, <span>IDMB </span><i class="bi bi-star-fill"></i>${imdb}</p>
                </div>
        `
        
        //Ảnh áp phích nhỏ ('sposter') 
        //Class 'cont' chứa các thông tin phim
        //Tên phim 
        //Thể loại và ngày phát hành phim
        //Loại phim (ví dụ: Phim lẻ, Phim bộ)
        //Đánh giá IMDB của phim
        search.appendChild(card);         //Thêm thẻ vào khu vực search bằng appendChild
    })

    search_input.addEventListener('keyup', ()=>{          //Thêm sự kiện 'keyup' vào ô nhập liệu tìm kiếm
        let filter = search_input.value.toUpperCase();    //Lấy giá trị từ ô nhập liệu và chuyển đổi thành chữ hoa
        let a = search.getElementsByTagName('a');         //Lấy tất cả các thẻ <a> trong khu vực tìm kiếm
        for(let i = 0; i < a.length; i++){
          let b = a[i].getElementsByClassName('cont')[0];
          let TextValue = b.textContent || b.innerText;
          if(TextValue.toUpperCase().indexOf(filter)>-1){
            a[i].style.display = "";  //Nếu giá trị tìm kiếm khớp với nội dung của thẻ, hiển thị thẻ đó
          }
          else{
            a[i].style.display = "none";  //Nếu không khớp, ẩn thẻ đó
          }
        }
    })
});
