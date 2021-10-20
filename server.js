const express = require('express')
const app = express()
const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({
    extended: true
}))

const MongoClient = require('mongodb').MongoClient;
app.set('view engine', 'ejs');

// app.listen(9000, function(){
//     console.log('9000접속')    
// })
var db;
MongoClient.connect('mongodb+srv://admin:1234@cluster0.hquqk.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', {
    useUnifiedTopology: true
}, function (에러, client) {
    //연결되면 할일
    if (에러) return console.log(에러)
    db = client.db('toDoApp');
    // db.collection('post').insertOne({
    //     이름: 'John',
    //     _id: 200
    // }, function (에러, 결과) {
    //     console.log('저장완료');
    // });

    app.listen(8080, function () {
        console.log('listening on 8080')
    });
})
app.get('/', function (요청, 응답) {
    응답.sendFile(__dirname + '/index.html')
})

app.get('/write', function (요청, 응답) {
    응답.sendFile(__dirname + '/write.html')
})
app.post('/add', function (요청, 응답) {
    db.collection('counter').findOne({
        name: '게시물갯수'
    }, function (에러, 결과) {
        var 총게시물갯수 = 결과.totalPost

        db.collection('post').insertOne({
            _id: 총게시물갯수 + 1,
            제목: 요청.body.title,
            날짜: 요청.body.date
        }, function (에러, 결과) {
            db.collection('counter').updateOne({
                name: '게시물갯수'
            }, {
                $inc: {
                    totalPost: 1
                }
            }, function (에러, 결과) {
                if (에러) {
                    return console.log(에러)
                }
                응답.send('전송완료');
            })
        })

    })
})

//list로 get 요청 접속하면 
// 실제 DB에 저장된 데이터들로 예쁘게 꾸며진 html을 보여줌

app.get('/list', function (요청, 응답) {
    db.collection('post').find().toArray(function (에러, 결과) {
        console.log(결과);
        응답.render('list.ejs', {
            posts: 결과
        });
    })
})

//해당 버튼 클릭시 해당 아이디 삭제-
app.delete('/delete', function (요청, 응답) {
    요청.body._id = parseInt(요청.body._id)
    db.collection('post').deleteOne(요청.body, function (에러, 결과) {
        console.log('삭제완료')
    })
    응답.send('삭제완료')
});