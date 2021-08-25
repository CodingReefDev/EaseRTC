setTimeout(() => {
    document.querySelectorAll("h1")[0].style.marginTop = "0px"
}, 200);
document.querySelectorAll("h1")[0].style.opacity = 1
document.querySelectorAll("img")[0].style.opacity = 0
var i = 0, i2 = 0;
setInterval(() => {
    if(i<1){
        i+=0.01
        document.querySelectorAll("img")[1].style.opacity = i
    }else if(i2<1){
        setTimeout(() => {
            i2+=0.01
        document.querySelectorAll("img")[0].style.opacity = i2
        document.querySelectorAll(".fixedHeader")[0].style.opacity = i2
        }, 1000);
    }
}, 1);