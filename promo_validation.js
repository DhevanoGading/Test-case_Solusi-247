const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = 8000;

app.use(bodyParser.json());

//data dummy promo
let promo = {
    nama_promo : "GEBYAR_100K",
    sisa_kuota : 1000
};

//endpoint untuk cek validasi promo
app.post('/validasi-promo', (req, res) => {
    let { nama_promo } = req.body;

    //mencari nama promo tersedia atau tidak
    if (nama_promo == promo.nama_promo) {

        //mencari sisa kuota promo
        if (promo.sisa_kuota > 0) {
            //mengurangi kuota promo
            promo.sisa_kuota--;

            res.json({
                error_code : 0,
                error_message : "",
                data : {
                    nama_promo : promo.nama_promo,
                    sisa_kuota : promo.sisa_kuota,
                    promo_tersedia: true
                }
            });
        }else{
            res.json({
                error_code : 2,
                error_message : "Kuota promo telah habis",
                data : {
                    nama_promo : promo.nama_promo,
                    sisa_kuota : promo.sisa_kuota,
                    promo_tersedia: false
                },
            });
        }
    }else{
        res.json({
            error_code : 1,
            error_message : "Promo tidak ditemukan",
            data : {}
        });
    }
});

//berjalannya server sesuai dengan port yang di tentukan
app.listen(port, () => {
    console.log(`Server berjalan pada http://localhost:${port}`);
});