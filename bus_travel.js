const express = require('express');
const bodyParser = require('body-parser');
const moment = require('moment');

const app = express();
const port = 8080;

app.use(bodyParser.json());

//10 data bus beserta kursi yang tersedia
let bus = {
    1: Array.from({ length: 40 }, (_, i) => ++i),
    2: Array.from({ length: 40 }, (_, i) => ++i),
    3: Array.from({ length: 40 }, (_, i) => ++i),
    4: Array.from({ length: 40 }, (_, i) => ++i),
    5: Array.from({ length: 40 }, (_, i) => ++i),
    6: Array.from({ length: 40 }, (_, i) => ++i),
    7: Array.from({ length: 40 }, (_, i) => ++i),
    8: Array.from({ length: 40 }, (_, i) => ++i),
    9: Array.from({ length: 40 }, (_, i) => ++i),
    10: Array.from({ length: 40 }, (_, i) => ++i)
};

//berisi data kursi yang dipesan
let bookedSeats = {
    1: [],
    2: [],
    3: [],
    4: [],
    5: [],
    6: [],
    7: [],
    8: [],
    9: [],
    10: []
};

app.post('/booking-kursi', (req, res) => {
    let { kode_paket_wisata, id_bus, id_kursi } = req.body;

    //mengecek apakah id bus tersedia atau tidak
    if (bus.hasOwnProperty(id_bus)) {

        //request kursi tidak boleh kosong dan lebih dari batas nomor kursi
        if (id_kursi !== "" && id_kursi <= 40) {
            
            //mengecek apakah nomor kursi sudah dipesan
            if (!bookedSeats[id_bus].includes(id_kursi)) {
                let status_kursi = {
                    booked : true,
                    id_customer : "BDG20221209M",
                    tanggal_booking : moment().format('YYYY-MM-DD HH:mm:ss') + " WIB"
                };
                
                //mengisi data kursi yang sudah dipesan
                bookedSeats[id_bus].push(id_kursi);
    
                res.json({
                    error_code : 0,
                    error_message : "",
                    data : {
                        kode_paket_wisata,
                        id_bus,
                        id_kursi,
                        status_kursi: status_kursi
                    }
                });
            } else {
                res.json({
                    error_code : 3,
                    error_message : `Nomor kursi ${bookedSeats[id_bus]} sudah dipesan`,
                    data : {}
                });
            }
        } else {
            res.json({
                error_code : 2,
                error_message : "Kursi tidak ditemukan",
                data : {}
            });
        }
    } else {
        res.json({
            error_code : 1,
            error_message : "Bus tidak ditemukan",
            data : {}
        });
    }
});

app.post('/kursi-tersedia', (req, res) => {
    let { kode_paket_wisata, id_bus } = req.body;

    if (bus.hasOwnProperty(id_bus)) {

        //filter untuk memilah data kursi yang belum dipesan
        let kursiTersedia = bus[id_bus].filter(
            kursi => !bookedSeats[id_bus].includes(kursi)
        );

        res.json({
            error_code: 0,
            error_message: "",
            data: {
                kode_paket_wisata,
                id_bus,
                kursi_tersedia: kursiTersedia
            }
        });
    } else {
        res.json({
            error_code: 1,
            error_message: "Bus tidak ditemukan",
            data: {}
        });
    }
});


app.listen(port, () => {
    console.log(`Server berjalan pada http://localhost:${port}`)
})