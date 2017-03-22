"use strict";

$(document).ready(function () {

    app.init();

});

var app = {

    settings: {
        
    },

    init: function() {

        var self = this;

        self.buildIndex();
        self.initButtons();

    },

    processWords: function(object) {
        var number = $(object).attr("data-number");
        console.log(number);
    },

    processTests: function(object) {
        var number = $(object).attr("data-number");
        console.log(number);
    },

    initButtons: function() {
        var self = this;
        $(".index td.words span").on("click", function() {self.processWords(this);});
        $(".index td.tests span").on("click", function() {self.processTests(this);});
    },

    buildIndex: function() {

        var self = this;

        var index = $(".index");

        var index_content = "<table>";
        self.parts.forEach(function(part, i, parts) {

            index_content += "<tr class='parts'>";

            index_content += "<td class='words'>";
            if (part.words.length > 0) {
                index_content += "<span data-number='" + part.number + "'>words: " + part.words.length + "</span>";
            }
            index_content += "</td>";

            index_content += "<td class='tests'>";
            if (part.tests.length > 0) {
                index_content += "<span data-number='" + part.number + "'>tests: " + part.tests.length + "</span>";
            }
            index_content += "</td>";

            index_content += "<th>" + part.comment.ru + "</th>";

            index_content += "</tr>";
        });
        index_content += "</table>";

        index.html(index_content);
    },

    parts: [
        {
            number: 1,
            comment: {ru: "Гласные", fi: "Vokaalit"},
            words: [
                {ru: "машина",    fi: "auto"},
                {ru: "автобус",   fi: "bussi"},
                {ru: "комната",   fi: "huone"},
                {ru: "дом",       fi: "talo"},
                {ru: "кошка",     fi: "kissa"},
                {ru: "собака",    fi: "koira"},
                {ru: "плохой",    fi: "huono"},
                {ru: "хороший",   fi: "hyvä"},
                {ru: "большой",   fi: "iso"},
                {ru: "маленький", fi: "pieni"},
                {ru: "цветок",    fi: "kukka"},
                {ru: "картина",   fi: "kuva"},
                {ru: "часы",      fi: "kello"},
                {ru: "книга",     fi: "kirja"},
                {ru: "чёрный",    fi: "musta"},
                {ru: "белый",     fi: "valkoinen"},
                {ru: "новый",     fi: "uusi"},
                {ru: "старый",    fi: "vanha"},
                {ru: "стол",      fi: "pöytä"},
                {ru: "стул",      fi: "tuoli"}
            ],
            tests: []
        },
        {
            number: 2,
            comment: {ru: "Дифтонги. Гармония гласных.",fi: "Diftongit. Vokaalisointu."},
            words: [
                {ru: "да",                      fi: "kyllä"},
                {ru: "не, нет",                 fi: "ei"},
                {ru: "хорошо",                  fi: "hyvin"},
                {ru: "удобный, приятный",       fi: "mukava"},
                {ru: "красивый",                fi: "kaunis"},
                {ru: "некрасивый, безобразный", fi: "ruma"},
                {ru: "отец",                    fi: "isä"},
                {ru: "мать",                    fi: "äiti"},
                {ru: "бабка, бабушка",          fi: "isoäiti"},
                {ru: "бабушка",                 fi: "mummo"},
                {ru: "дед, дедушка",            fi: "isoisä"},
                {ru: "старик, дед",             fi: "ukko"},
                {ru: "женщина",                 fi: "nainen"},
                {ru: "мужчина",                 fi: "mies"},
                {ru: "мальчик, юноша, сын",     fi: "poika"},
                {ru: "девочка, девушка, дочь",  fi: "tyttö"},
                {ru: "сестра",                  fi: "sisko (sisär)"},
                {ru: "брат",                    fi: "veli"},
                {ru: "семья",                   fi: "perhe"},
                {ru: "молодой",                 fi: "nuori"}
            ],
            tests: []
        },
        {
            number: 3,
            comment: {ru: "Согласные. Ударение.", fi: "Konsonantit. Paino."},
            words: [
                {ru: "я",                           fi: "minä"},
                {ru: "ты",                          fi: "sinä"},
                {ru: "он, она (только о людях)",    fi: "hän"},
                {ru: "мы",                          fi: "me"},
                {ru: "вы",                          fi: "te"},
                {ru: "они (только о людях)",        fi: "he"},
                {ru: "он, она, оно (о животных, вещах и событиях)", fi: "se"},
                {ru: "они (о животных, вещах и событиях)",          fi: "ne"},
                {ru: "это (ед. число)",             fi: "tämä"},
                {ru: "эти (мн. число)",             fi: "nämä"},
                {ru: "то (ед. число)",              fi: "tuo"},
                {ru: "те",                          fi: "nuo"},
                {ru: "карта",                       fi: "kartta"},
                {ru: "город",                       fi: "kaupunki"},
                {ru: "страна, земля",               fi: "maa"},
                {ru: "Финляндия",                   fi: "Suomi"},
                {ru: "Россия",                      fi: "Venäjä"},
                {ru: "Швеция",                      fi: "Ruotsi"},
                {ru: "Москва",                      fi: "Moskova"},
                {ru: "Санкт-Петербург",             fi: "Pietari"}
            ],
            tests: []
        },
        {
            number: 4,
            comment: {ru: "Первые предложения. Глагол olla."},
            words: [
                {ru: "сестра",                  fi: "sisar (sisko)"},
                {ru: "дочь",                    fi: "tytär"},
                {ru: "жена",                    fi: "vaimo"},
                {ru: "тётя",                    fi: "täti"},
                {ru: "дядя, брат матери",       fi: "eno (äidin veli)"},
                {ru: "дядя, брат отца",         fi: "setä (isän veli)"},
                {ru: "родители",                fi: "vanhemmat"},
                {ru: "дедушка и бабушка",       fi: "isovanhemmat"},
                {ru: "дед, дедушка",            fi: "vaari (pappa, ukki, ukko)"},
                {ru: "ребенок",                 fi: "lapsi"},
                {ru: "кузен (кузина)",          fi: "serkku"},
                {ru: "свекровь, тёща",          fi: "anoppi (miehen äiti, vaimon äiti)"},
                {ru: "свекор, тесть",           fi: "appi (miehen isä, vaimon isä)"},
                {ru: "сосед, соседка",          fi: "naapuri"},
                {ru: "товарищ",                 fi: "toveri"},
                {ru: "друг, подруга",           fi: "ystävä"},
                {ru: "быть замужем (женатым)",  fi: "olla naimisissa"},
                {ru: "быть (находиться) дома",  fi: "olla kotona"},
                {ru: "быть на работе",          fi: "olla töissä"},
                {ru: "быть в гостях",           fi: "olla kylässä"}
            ],
            tests: [
                {ru: "Это я.", fi: "Tämä on minä."},
                {ru: "Это сестра.", fi: "Tämä on sisko."},
                {ru: "То ты (виден вдали).", fi: "Tuo on sinä"},
                {ru: "То брат (виден вдали).", fi: "Tuo on veli."},
                {ru: "Это мать и отец.", fi: "Nämä ovat äiti ja isä."},
                {ru: "Это родители.", fi: "Nämä ovat vanhemmat."},
                {ru: "То бабушка и дедушка (видны вдали).", fi: "Nuo ovat mummo ja vaari."},
                {ru: "То свекровь и свекор (видны вдали).", fi: "Nuo ovat anoppi ja appi."},
                {ru: "Это дом.", fi: "Se (tämä) on talo."},
                {ru: "Это дома.", fi: "Ne (nämä) ovat talot."},
                {ru: "Она дочь.", fi: "Hän on tytär."},
                {ru: "Он брат.", fi: "Hän on veli."},
                {ru: "Это собака.", fi: "Se on koira."},
                {ru: "Это кошка.", fi: "Se on kissa."},
                {ru: "Я мать.", fi: "Minä olen äiti."},
                {ru: "Ты отец.", fi: "Sinä olet isä."},
                {ru: "Он сын.", fi: "Hän on poika."},
                {ru: "Мы в Финляндии.", fi: "Me olemme Suamessa."},
                {ru: "Вы в России.", fi: "Te olette Venäjällä."},
                {ru: "Они в Москве.", fi: "He ovat Moskovassa."},
                {ru: "Я женат.", fi: "Olen naimisissa."},
                {ru: "Мы дома.", fi: "Olemme kotona."},
                {ru: "Сын на работе.", fi: "Poika on töissä."},
                {ru: "Родители в гостях.", fi: "Vanhemmat ovat kylässä."},
                {ru: "Через тернии к звездам!", fi: "Vaikeuksien kautta tähtiin!"}
            ]
        },
    ]


};