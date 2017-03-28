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
        self.displayMode();
        self.initInputsWords();
        self.initInputsTests();
        self.initInputsDict();

    },

    initInputsDict: function() {
        var self = this;
        $(".main").on("change", ".dict-panel input", function() {

            var question = self.test.sequence[self.test.index].data.ru;
            var answer = self.test.sequence[self.test.index].data.fi;
            var value = $(this).val();
            var tip = $(".main .dict-panel .tip");
            var dict_word = $("#dict-word-" + self.test.index);

            tip.text(self.test.sequence[self.test.index].data.fi);

            if (value === answer) {

                console.log("Good!");
                tip.hide();
                dict_word.html("<span class='glyphicon glyphicon-ok-sign'></span>");

                if (self.test.counter < 3) {
                    dict_word.removeClass("pending").addClass("good");
                }

                self.test.counter = 0;
                self.test.index ++;

            } else {

                console.log(self.test.counter);

                switch (self.test.counter) {
                    case 0:
                    case 1:
                        self.test.counter++;
                        break;
                    case 2:
                        tip.show();
                        dict_word.html("<span class='glyphicon glyphicon-exclamation-sign'></span>");
                        dict_word.removeClass("pending").addClass("so-so");
                        self.test.result = 'so-so';
                        self.test.counter++;
                        break;
                    case 3:
                        console.log("Fail! " + answer + " : " + value);
                        tip.hide();
                        dict_word.html("<span class='glyphicon glyphicon-remove-sign'></span>");
                        dict_word.removeClass("pending").addClass("fail");
                        self.test.counter = 0;
                        self.test.index ++;
                        break;
                }

            }

            $(".main .dict-panel .question").text(self.test.sequence[self.test.index].data.ru);
            $(".main .dict-panel input[name=answer]").val('');
        });
    },

    initInputsWords: function() {
        var self = this;

        $(".main").on("change", "input.words", function() {
            var number = $(this).attr("data-number");
            var i = $(this).attr("data-i");
            var td_result = $(".main .test-list tr.i_" + i + " td:last-child");

            if (self.checkWord(this)) {
                td_result.html("<span class='result-ok glyphicon glyphicon-ok-sign'></span>");
                i++;
                $(".main tr.i_" + i + " input").focus();

            } else {
                td_result.html("<span class='result-fail glyphicon glyphicon-remove-sign' title='"
                    + self.parts[number].words[i].fi + "'></span>");
            }
        });
    },

    checkWord: function(object) {
        var self = this;
        var value = object.value;
        var number = $(object).attr("data-number");
        var i = $(object).attr("data-i");
        var result = false;

        var word = self.parts[number].words[i].fi;

        if (value === word) {
            result = true;
        }

        return result;
    },

    initInputsTests: function() {
        var self = this;

        $(".main").on("change", "input.tests", function() {
            var number = $(this).attr("data-number");
            var i = $(this).attr("data-i");
            var td_result = $(".main .test-list tr.i_" + i + " td:last-child");

            if (self.checkTest(this)) {
                td_result.html("<span class='result-ok glyphicon glyphicon-ok-sign'></span>");
                i++;
                $(".main tr.i_" + i + " input").focus();

            } else {
                td_result.html("<span class='result-fail glyphicon glyphicon-remove-sign' title='"
                    + self.parts[number].tests[i].fi + "'></span>");
            }
        });
    },

    checkTest: function(object) {
        var self = this;
        var value = object.value;
        var number = $(object).attr("data-number");
        var i = $(object).attr("data-i");
        var result = false;

        var word = self.parts[number].tests[i].fi;

        if (value === word) {
            result = true;
        }

        return result;
    },

    displayMode: function() {
        var self = this;
        var mode = self.mode.get().name;
        $("button.mode-selector").css("border", "none");
        $("button[name=" + mode + "_mode]").css("border", "2px solid darkgreen");
    },

    processPart: function(object, entity) {
        var self = this;
        var number = $(object).attr("data-number") - 1;
        var mode = self.mode.get();
        var part = self.parts[number];
        var data = self.parts[number][entity];
        var content = "";
        var main = $(".main");

        switch(mode.name) {

            case "view":
                content = "<table class='view-list'><tr><th class='i'>N</th><th class='src'>ru</th><th class='dst'>fi</th></tr>";
                data.forEach(function(el, i, data){
                    content += "<tr class='i_" + i + "'><td class='i'><span class='label label-success'>" + (i + 1) + "</span></td><td class='src'>" + el.ru + "</td><td class='dst'>" + el.fi + "</td></tr>";
                });
                content += "</table>";
                main.html(content);
                break;

            case "test":
                content = "<table class='test-list'><tr><th class='i'>N</th><th class='src'>ru</th><th class='dst'>fi</th><th class='result'></th></tr>";
                data.forEach(function(el, i, data){
                    content += "<tr class='i_" + i + "'><td class='i'><span class='label label-success'>" + (i + 1) + "</span></td><td class='src'>" + el.ru
                        + "</td><td class='dst'><input class='" + entity + "' type='text' data-number='" + number + "' data-i='" + i + "'/></td>"
                    + "<td class='result'></td></tr>";
                });
                content += "</table>";
                main.html(content);
                $(".test-list tr.i_0 input").focus();
                break;

            default:
                break;
        }
    },

    processDebug: function() {
        console.log("DEBUG");
        var self = this;
        self.testSynthesis();
    },

    testSynthesis: function() {
        if ('speechSynthesis' in window) {
            // Synthesis support. Make your web apps talk!
            console.log("YES");

            var msg = new SpeechSynthesisUtterance('I see dead people!');
            //msg.voice = speechSynthesis.getVoices().filter(function(voice) { return voice.name == 'Whisper'; })[0];
            speechSynthesis.speak(msg);

        } else {
            console.log("NO");
        }
    },

    selectMode: function(object, self) {
        var mode = $(object).attr("data-mode");
        self.mode.set(mode);
        self.buildIndex();
        self.displayMode();
    },

    initButtons: function() {
        var self = this;
        $(".index")
            .on("click", "td.words span", function() {self.processPart(this, "words");})
            .on("click", " td.tests span", function() {self.processPart(this, "tests");})
            .on("click", "td.words50 span", function() {self.processDict(this); $(".dict-panel input").focus(); });
        $(".mode-selector").on("click", function() {self.selectMode(this, self);});
        $("button[name=debug]").on("click", function() {self.processDebug();});
    },

    processDict: function(object) {
        var self = this;
        var main = $(".main");
        var number = $(object).attr('data-number');
        var len = $(object).attr('data-len');

        self.test.sequence = self.dictionary[number];
        self.test.index = 0;
        self.test.counter = 0;
        self.test.fail = 0;
        self.test.good = 0;
        self.test.result = 'process';

        var panel = "<div class='dict-panel'>"
            + "<span class='question label label-info'>" + self.test.sequence[self.test.index].data.ru + "</span>"
            + "<span class='tip label label-warning' style='display: none'>" + self.test.sequence[self.test.index].data.fi + "</span>"
            + "<input name='answer' type='text' />"
            + "</div>";
        var progress = "<div class='dict-progress'>";


        self.test.sequence.forEach(function(word, i, words) {
            progress += "<div id='dict-word-" + i + "' data-i='" + i + "' data-fi='" + word.data.fi + "' data-ru='" + word.data.ru + "' class='word word" + len + " pending'>"
            + "<span class='glyphicon glyphicon-question-sign'></span>"
            + "</div>";
        });
        progress += "</div>";

        main.html(panel + progress);
    },

    buildIndex: function() {

        var self = this;
        var index = $(".index");
        var main = $(".main");
        var mode = self.mode.data.selected.toString();
        var content = "";

        main.html("");

        switch(mode) {
            case "0":

                // Содержание для просмотра разделов

            case "1":

                // Содержание для тестирования по разделам

                content = "<table>";

                content += "<tr><th>№</th><th>Слова</th><th>Тесты</th><th>Тема</th></tr>";

                self.parts.forEach(function(part, i, parts) {

                    content += "<tr class='parts'>";

                    content += "<td class='number'>" + (i + 1) + "</td>";

                    content += "<td class='words'>";
                    if (part.words.length > 0) {
                        content += "<span data-number='" + part.number + "'>" + part.words.length + "</span>";
                    }
                    content += "</td>";

                    content += "<td class='tests'>";
                    if (part.tests.length > 0) {
                        content += "<span data-number='" + part.number + "'>" + part.tests.length + "</span>";
                    }
                    content += "</td>";

                    content += "<td class='comment'>" + part.comment.ru + "</td>";

                    content += "</tr>";
                });
                content += "</table>";
                break;

            case "2":

                // Содержание для тестирования по 50 слов

                content = "<table>";
                content += "<tr><th class='number'>№</th><th class='comment'>Выборка по 50</th></tr>";
                self.buildDictionary(50);
                self.dictionary.forEach(function(selection, s, selections){
                    content += "<tr>"
                        + "<td class='number words50'><span data-len='50' data-number='" + s + "'>" + selection[0].index + "..." + selection[49].index + "</span></td>"
                        + "<td class='comment words50'><span data-len='50' data-number='" + s + "'>" + selection[0].data.ru + " ... " + selection[49].data.ru + "</span></td>"
                    + "</tr>";
                });
                content += "</table>";
                break;

            case "3":

                // Содержание для тестирования по 100 слов

                content = "<table>";
                content += "<tr><th class='number'>№</th><th class='comment'>Выборка по 100</th></tr>";
                self.buildDictionary(100);
                self.dictionary.forEach(function(selection, s, selections){
                    content += "<tr><td class='number'>" + selection[0].index + "..." + selection[99].index + "</td>"
                        + "<td class='comment'>" + selection[0].data.ru + " ... " + selection[99].data.ru + "</td></tr>";
                });
                content += "</table>";
                break;

            default:
                break;
        }
        index.html(content);

    },

    buildDictionary: function(len) {
        var self = this;
        var i = 0;
        var j = 0;
        self.dictionary = [];
        var selection = [];

        self.parts.forEach(function(part, p, parts) {
            part.words.forEach(function(word, w, words){
                 selection[j] = {
                     part: p,
                     word: w,
                     index: (i * len + j + 1),
                     data: word
                 };
                if (++j >= len) {
                    self.dictionary[i] = selection;
                    selection = [];
                    j = 0;
                    i++;
                }
            });
        });
    },

    mode: {

        data: {
            modes: [
                {name: "view"},
                {name: "test"},
                {name: "test50"},
                {name: "test100"}
            ],
            selected: 2
        },

        get: function() {
            return this.data.modes[this.data.selected];
        },

        set: function(mode) {
            this.data.selected = mode;
        }

    },

    test: {
        sequence: [],
        index: 0,
        counter: 0,
        words: 0,
        fail: 0,
        good: 0,
        result: 'process'
    },

    dictionary: [

    ],

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
        {
            number: 5,
            comment: {ru: "Первые глаголы. Вопросы Kuka? Mikä?"},
            words: [
                {ru: "жить",                    fi: "asua"},
                {ru: "сидеть",                  fi: "istua"},
                {ru: "стоять",                  fi: "seisoa"},
                {ru: "спросить, спрашивать",    fi: "kysyä"},
                {ru: "плакать",                 fi: "itkeä"},
                {ru: "говорить",                fi: "puhua"},
                {ru: "петь",                    fi: "laulaa"},
                {ru: "платить, стоить",         fi: "maksaa"},
                {ru: "танцевать",               fi: "tanssia"},
                {ru: "смотреть",                fi: "katsoa"},
                {ru: "что (ед.ч.)?",            fi: "mikä"},
                {ru: "что (мн. ч.)? ",          fi: "mitkä"},
                {ru: "кто (ед.ч.)?",            fi: "kuka"},
                {ru: "кто (ед.ч.)?",            fi: "ketkä"},
                {ru: "школа",                   fi: "koulu"},
                {ru: "серый",                   fi: "harmaa"},
                {ru: "зеленый",                 fi: "vihreä"},
                {ru: "послушный",               fi: "kiltti"},
                {ru: "бедный",                  fi: "köyhä"},
                {ru: "богатый",                 fi: "rikas"}
            ],
            tests: [
                {ru: "Кто это?",                fi: "Mikä tämä on?"},
                {ru: "Это кошка.",              fi: "Tämä on kissa."},
                {ru: "Что то?",                 fi: "Mikä tuo on?"},
                {ru: "То автомобиль.",          fi: "Tuo on auto."},
                {ru: "Кто это?",                fi: "Mitkä nämä ovat?"},
                {ru: "Это кошки.",              fi: "Nämä ovat kissat."},
                {ru: "Кто это?",                fi: "Kuka tämä on?"},
                {ru: "Это послушный мальчик.",  fi: "Tämä on kiltti poika."},
                {ru: "Кто то?",                 fi: "Kuka tuo on?"},
                {ru: "То красивая девушка.",    fi: "Tuo on kaunis tyttö."},
                {ru: "Кто они?",                fi: "Ketkä he ovat?"},
                {ru: "Это Вера и Лена.",        fi: "He ovat Veera ja Leena."},

                                                // tyyppi 1

                {ru: "я живу",                  fi: "minä asun"},
                {ru: "мы живем",                fi: "me asumme"},
                {ru: "ты живешь",               fi: "sinä asut"},
                {ru: "вы живете",               fi: "te asutte"},
                {ru: "он живет",                fi: "hän asuu"},
                {ru: "они живут",               fi: "he asuvat"},
                {ru: "я стою",                  fi: "minä seison"},
                {ru: "мы стоим",                fi: "me seisomme"},
                {ru: "ты стоишь",               fi: "sinä seisot"},
                {ru: "вы стоите",               fi: "te seisotte"},
                {ru: "она стоит",               fi: "hän seisoo"},
                {ru: "они стоят",               fi: "he seisovat"},
                {ru: "я спрашиваю",             fi: "minä kysyn"},
                {ru: "мы спрашиваем",           fi: "me kysymme"},
                {ru: "ты спрашиваешь",          fi: "sinä kysyt"},
                {ru: "вы спрашиваете",          fi: "te kysytte"},
                {ru: "она спрашивает",          fi: "hän kysyy"},
                {ru: "они спрашивают",          fi: "he kysyvät"}
            ]
        },
        {
            number: 6,
            comment: {ru: "Типы глаголов.", fi: "Verbityypit."},
            words: [
                {ru: "есть",                        fi: "syödä"},
                {ru: "пить",                        fi: "juoda"},
                {ru: "мочь, быть в состоянии",      fi: "voida"},
                {ru: "ходить, посещать",            fi: "käydä"},
                {ru: "приходить, приезжать",        fi: "tulla"},
                {ru: "идти, ехать",                 fi: "mennä"},
                {ru: "кусать",                      fi: "purra"},
                {ru: "мыть, стирать",               fi: "pestä"},
                {ru: "подниматься, вставать",       fi: "nousta"},
                {ru: "просыпаться",                 fi: "herätä"},
                {ru: "хотеть, желать",              fi: "haluta"},
                {ru: "возвращаться, возвращать",    fi: "palata"},
                {ru: "прибирать, делать уборку",    fi: "siivota"},
                {ru: "мешать",                      fi: "häiritä"},
                {ru: "нуждаться, требовать",        fi: "tarvita"},
                {ru: "выбирать",                    fi: "valita"},
                {ru: "стареть",                     fi: "vanheta"},
                {ru: "ухудшаться",                  fi: "paheta"},
                {ru: "много",                       fi: "paljon"},
                {ru: "сейчас, теперь",              fi: "nyt"},
            ],
            tests: [

                {ru: "I. *@a",                      fi: "*@ | *@@"},    // istua, puhua, itkeä, laulaa, maksaa, tanssia, kysyä
                {ru: "II. *da",                     fi: "* | *"},    // syödä, juoda, voida, käydä
                {ru: "III. *la, na, ra, ta, sta",   fi: "*e, *se | *ee, *see"},    // tulla, mennä, purra, pestä, nousta
                {ru: "IV. *ta",                     fi: "*a | *aa"},    // herätä, haluta, palata, siivota
                {ru: "V. *itä",                     fi: "*itse | *itsee"},    // häiritä, tarvita, valita
                {ru: "VI. *eta",                    fi: "*ene | *enee"},    // vanheta, paheta

                                            // tyyppi2
                {ru: "я ем",                fi: "minä syön"},
                {ru: "мы едим",             fi: "me syömme"},
                {ru: "ты ешь",              fi: "sinä syöt"},
                {ru: "вы едите",            fi: "te syötte"},
                {ru: "он ест",              fi: "hän syö"},
                {ru: "они едят",            fi: "he syövät"},
                                            // tyyppi2
                {ru: "я пью",               fi: "minä juon"},
                {ru: "мы пьем",             fi: "me juomme"},
                {ru: "ты пьешь",            fi: "sinä juot"},
                {ru: "вы пьете",            fi: "te juotte"},
                {ru: "он пьет",             fi: "hän juo"},
                {ru: "они пьют",            fi: "he juovat"},
                                            // tyyppi3
                {ru: "я еду",               fi: "minä menen"},
                {ru: "мы едем",             fi: "me menemme"},
                {ru: "ты едешь",            fi: "sinä menet"},
                {ru: "вы едете",            fi: "te menette"},
                {ru: "она едет",            fi: "hän menee"},
                {ru: "они едут",            fi: "he menevät"},
                                            // tyyppi3
                {ru: "я прихожу",           fi: "minä tulen"},
                {ru: "мы приходим",         fi: "me tulemme"},
                {ru: "ты приходишь",        fi: "sinä tulet"},
                {ru: "вы приходите",        fi: "te tulette"},
                {ru: "она приходит",        fi: "hän tulee"},
                {ru: "они приходят",        fi: "he tulevat"},
                                            // tyyppi3
                {ru: "я мою",               fi: "minä pesen"},
                {ru: "мы моем",             fi: "me pesemme"},
                {ru: "ты моешь",            fi: "sinä peset"},
                {ru: "вы моете",            fi: "te pesette"},
                {ru: "он моет",             fi: "hän pesee"},
                {ru: "они моют",            fi: "he pesevät"},
                                            // tyyppi4
                {ru: "я просыпаюсь",        fi: "minä herään"},
                {ru: "мы просыпаемся",      fi: "me heräämme"},
                {ru: "ты просыпаешься",     fi: "sinä heräät"},
                {ru: "вы просыпаетесь",     fi: "te heräätte"},
                {ru: "она просыпается",     fi: "hän herää"},
                {ru: "они просыпаются",     fi: "he heräävät"},
                                            // tyyppi4
                {ru: "я хочу",              fi: "minä haluan"},
                {ru: "мы хотим",            fi: "me haluamme"},
                {ru: "ты хочешь",           fi: "sinä haluat"},
                {ru: "вы хотите",           fi: "te haluatte"},
                {ru: "она хочет",           fi: "hän haluaa"},
                {ru: "они хотят",           fi: "he haluavat"},
                                            // tyyppi5
                {ru: "я мешаю",             fi: "minä häiritsen"},
                {ru: "мы мешаем",           fi: "me häiritsemme"},
                {ru: "ты мешаешь",          fi: "sinä häiritset"},
                {ru: "вы мешаете",          fi: "te häiritsette"},
                {ru: "она мешает",          fi: "hän häiritsee"},
                {ru: "они мешают",          fi: "he häiritsevät"},
                                            // tyyppi6
                {ru: "я старею",            fi: "minä vanhenen"},
                {ru: "мы стареем",          fi: "me vanhenemme"},
                {ru: "ты стареешь",         fi: "sinä vanhenet"},
                {ru: "вы стареете",         fi: "te vanhenette"},
                {ru: "он стареет",          fi: "hän vanhenee"},
                {ru: "они стареют",         fi: "he vanhenevat"},
            ]
        },
        {
            number: 7,
            comment: {ru: "Порядок слов."},
            words: [
                {ru: "какой национальности",    fi: "minkä maalainen"},
                {ru: "гражданство",             fi: "kansalaisuus"},
                {ru: "иностранец",              fi: "ulkomaalainen"},
                {ru: "финн (финка), финский",   fi: "suomalainen"},
                {ru: "русский",                 fi: "venäläinen"},
                {ru: "швед, шведский",          fi: "ruotsalainen"},
                {ru: "Германия",                fi: "Saksa"},
                {ru: "Франция",                 fi: "Ranska"},
                {ru: "Дания",                   fi: "Tanska"},
                {ru: "Норвегия",                fi: "Norja"},
                {ru: "Польша",                  fi: "Puola"},
                {ru: "Латвия",                  fi: "Latvia"},
                {ru: "Литва",                   fi: "Liettua"},
                {ru: "Эстония",                 fi: "Viro"},
                {ru: "Европа",                  fi: "Eurooppa"},
                {ru: "Азия",                    fi: "Aasia"},
                {ru: "Америка",                 fi: "Amerikka"},
                {ru: "Африка",                  fi: "Afrikka"},
                {ru: "Австралия",               fi: "Australia"},
                {ru: "Петрозаводск",            fi: "Petroskoi"},
            ],
            tests: [
                {ru: "Это карта?",                                  fi: "Onko se kartta?"},
                {ru: "Это ли карта?",                               fi: "Sekö kartta on?"},
                {ru: "Карта ли это?",                               fi: "Karttako se on?"},
                {ru: "Разве это не карта?",                         fi: "Eikö se ole kartta?"},
                {ru: "Я живу в Эстонии.",                           fi: "Minä asun Virossa."},
                {ru: "Тина живёт во Франции.",                      fi: "Tiina asuu Ranskassa."},
                {ru: "Она (он) француженка (француз).",             fi: "Hän on ranskalainen."},
                {ru: "Мы живём в Германии.",                        fi: "Asumme Saksassa."},
                {ru: "Ты норвежец.",                                fi: "Olet norjalainen."},
                {ru: "Он русский.",                                 fi: "Hän on venäläinen."},
                {ru: "Ты живёшь в Петрозаводске?",                  fi: "Asutko sinä Petroskoissa?"},
                {ru: "Вы в Дании?",                                 fi: "Oletteko Tanskassa?"},

                {ru: "Какой национальности он?",                    fi: "Minkä maalainen hän on?"},
                {ru: "На каком языке он говорит?",                  fi: "Mitä kieltä hän puhuu?"},
                {ru: "Он - американец.",                            fi: "Hän on amerikkalainen."},
                {ru: "Он - европеец.",                              fi: "Hän on eurooppalainen."},
                {ru: "Он - скандинав.",                             fi: "Hän on skandinavialainen."},
                {ru: "Он - англичанин. Он говорит по-английски.",   fi: "Hän on englantilainen. Hän puhuu englantia."},
                {ru: "Он - немец. Он говорит по-немецки.",          fi: "Hän on saksalainen. Hän puhuu saksaa."},
                {ru: "Он - датчаниин. Он говорит по-датски.",       fi: "Hän on tanskalainen. Hän puhuu tanskaa."},
                {ru: "Он - норвежец. Он говорит по-норвежки.",      fi: "Hän on norjalainen. Hän puhuu norjaa."},
                {ru: "Он - москвич.",                               fi: "Hän on moskovalainen."},
                {ru: "Он - хельсинчанин.",                          fi: "Hän on helsinkiläinen."},
                {ru: "Он - русский. Он говорит по-русски.",         fi: "Hän on venäläinen. Hän puhuu venäjää."},
                {ru: "Он - швед. Он говорит по-шведски.",           fi: "Hän on ruotsalainen. Hän puhuu ruotsia."},
                {ru: "Он - финн. Он говорит по-фински.",            fi: "Hän on suomalainen. Hän puhuu suomea."},
            ]
        },
        {
            number: 8,
            comment: {ru: "Чередование ступеней согласных (сильная и слабая ступень).", fi: "Konsonanttien astevaihtelu (vahva aste ja heikko aste)."},
            words: [
                {ru: "спать",                   fi: "nukkua"},
                {ru: "выучить, учить",          fi: "oppia"},
                {ru: "брать",                   fi: "ottaa"},
                {ru: "читать",                  fi: "lukea"},
                {ru: "приезжать, прибывать",    fi: "saapua"},
                {ru: "знать",                   fi: "tietää"},
                {ru: "удить рыбу",              fi: "onkia"},
                {ru: "давать",                  fi: "antaa"},
                {ru: "запрещать",               fi: "kieltää"},
                {ru: "наклоняться",             fi: "kumartua"},
                {ru: "стрелять",                fi: "ampua"},
                {ru: "закрывать",               fi: "sulkea"},
                {ru: "исследовать, изучать",    fi: "tutkia"},
                {ru: "еда, пища",               fi: "ruoka"},
                {ru: "хлеб",                    fi: "leipä"},
                {ru: "берег, пляж",             fi: "ranta"},
                {ru: "вечер",                   fi: "ilta"},
                {ru: "борода",                  fi: "parta"},
                {ru: "расчёска",                fi: "kampa"},
                {ru: "кнопка",                  fi: "nasta"},
            ],
            tests: [
                {ru: "kk",          fi: "k"},
                {ru: "pp",          fi: "p"},
                {ru: "tt",          fi: "t"},
                {ru: "k",           fi: "..."},
                {ru: "p",           fi: "v"},
                {ru: "t",           fi: "d"},
                {ru: "nk",          fi: "ng"},
                {ru: "nt",          fi: "nn"},
                {ru: "lt",          fi: "ll"},
                {ru: "rt",          fi: "rr"},
                {ru: "mp",          fi: "mm"},
                {ru: "lke",         fi: "lje"},
                {ru: "st, sk, tk",  fi: "st, sk, tk"},

                {ru: "цветок - цветы",                  fi: "kukka - kukat"},
                {ru: "спать - я сплю",                  fi: "nukkua - nukun"},
                {ru: "свекровь - свекрови",             fi: "anoppi - anopit"},
                {ru: "учить - я учу",                   fi: "oppia - opin"},
                {ru: "девочка - девочки",               fi: "tyttö - tytöt"},
                {ru: "брать - ты берёшь",               fi: "ottaa - otat"},
                {ru: "еда - в еде",                     fi: "ruoka - ruoassa"},
                {ru: "читать - вы читаете",             fi: "lukea - luette"},
                {ru: "хлеб - в хлебе",                  fi: "leipä - leivässä"},
                {ru: "приезжать - я приезжаю",          fi: "saapua - saavun"},
                {ru: "тётя - тёти",                     fi: "täti - tädit"},
                {ru: "знать - я знаю",                  fi: "tietää - tiedän"},
                {ru: "город - в городе",                fi: "kaupunki - kaupungissa"},
                {ru: "удить - мы ловим рыбу",           fi: "onkia - ongimme"},
                {ru: "берег - на берегу",               fi: "ranta - rannalla"},
                {ru: "давать - ты даёшь",               fi: "antaa - annat"},
                {ru: "вечер - вечером",                 fi: "ilta - illalla"},
                {ru: "запрещать - я запрещаю",          fi: "kieltää - kiellän"},
                {ru: "борода - в бороде",               fi: "parta - parrassa"},
                {ru: "наклоняться - ты наклоняешься",   fi: "kumartua - kumarrut"},
                {ru: "расчёска - расчёски",             fi: "kampa - kammat"},
                {ru: "стрелять - вы стреляете",         fi: "ampua - ammutte"},
                {ru: "закрывать - я закрываю",          fi: "sulkea - suljen"},
                {ru: "кнопка - кнопки",                 fi: "nasta - nastat"},
                {ru: "исследовать - исследую",          fi: "tutkia - tutkin"},

                {ru: "брать, учить, спать, рыбачить - сильная perusmuoto",      fi: "ottaa, oppia, nukkua, onkia"},
                {ru: "брать, учить, спать, рыбачить - слабая minä",             fi: "otan, opin, nukun, ongin"},
                {ru: "брать, учить, спать, рыбачить - слабая sinä",             fi: "otat, opit, nukut, ongit"},
                {ru: "брать, учить, спать, рыбачить - сильная hän",             fi: "ottaa, oppii, nukkuu, onkii"},
                {ru: "брать, учить, спать, рыбачить - слабая me",               fi: "otamme, opimme, nukumme, ongimme"},
                {ru: "брать, учить, спать, рыбачить - слабая te",               fi: "otatte, opitte, nukutte, ongitte"},
                {ru: "брать, учить, спать, рыбачить - сильная he",              fi: "ottavat, oppivat, nukkuvat, onkivat"},

                {ru: "знать, приезжать, читать, давать - сильная perusmuoto",   fi: "tietää, saapua, lukea, antaa"},
                {ru: "знать, приезжать, читать, давать - слабая minä",          fi: "tiedän, saavun, luen, annan"},
                {ru: "знать, приезжать, читать, давать - слабая sinä",          fi: "tiedät, saavut, luet, annat"},
                {ru: "знать, приезжать, читать, давать - сильная hän",          fi: "tietää, saapuu, lukee, antaa"},
                {ru: "знать, приезжать, читать, давать - слабая me",            fi: "tiedämme, saavumme, luemme, annamme"},
                {ru: "знать, приезжать, читать, давать - слабая te",            fi: "tiedätte, saavutte, luette, annatte"},
                {ru: "знать, приезжать, читать, давать - сильная he",           fi: "tietävät, saapuvat, lukevat, antavat"},
            ]
        },
        {
            number: 9,
            comment: {ru: "Глаголы 2 типа.", fi: "Verbityyppi 2."},
            words: [
                {ru: "курить",                              fi: "tupakoida"},
                {ru: "читать лекцию",                       fi: "luennoida"},
                {ru: "парковаться",                         fi: "pysäköidä"},
                {ru: "делать",                              fi: "tehdä"},
                {ru: "видеть",                              fi: "nähdä"},
                {ru: "плавать",                             fi: "uida"},
                {ru: "приносить, привозить",                fi: "tuoda"},
                {ru: "мечтать, грезить",                    fi: "unelmoida"},
                {ru: "нести, уводить, отводить",            fi: "viedä"},
                {ru: "получать, мочь, иметь позволение",    fi: "saada"},
                {ru: "оставаться, остаться, отставать",     fi: "jäädä"},
                {ru: "продавать",                           fi: "myydä"},
                {ru: "неделя",                              fi: "viikko"},
                {ru: "понедельник",                         fi: "maanantai"},
                {ru: "вторник",                             fi: "tiistai"},
                {ru: "среда",                               fi: "keskiviikko"},
                {ru: "четверг",                             fi: "torstai"},
                {ru: "пятница",                             fi: "perjantai"},
                {ru: "суббота",                             fi: "lauantai"},
                {ru: "воскресенье",                         fi: "sunnuntai"},
            ],
            tests: [
                {ru: "нести, читать лекцию, парковаться, оставаться - сильная perusmuoto",      fi: "viedä, luennoida, pysäköidä, jäädä"},
                {ru: "нести, читать лекцию, парковаться, оставаться - слабая minä",             fi: "vien, luennoin, pysäköin, jään"},
                {ru: "нести, читать лекцию, парковаться, оставаться - слабая sinä",             fi: "viet, luennoit, pysäköit, jäät"},
                {ru: "нести, читать лекцию, парковаться, оставаться - сильная hän",             fi: "vie, luennoi, pysäköi, jää"},
                {ru: "нести, читать лекцию, парковаться, оставаться - слабая me",               fi: "viemme, luennoimme, pysäköimme, jäämme"},
                {ru: "нести, читать лекцию, парковаться, оставаться - слабая te",               fi: "viette, luennoitte, pysäköitte, jäätte"},
                {ru: "нести, читать лекцию, парковаться, оставаться - сильная he",              fi: "vievät, luennoivat, pysäköivät, jäävät"},

                // ИСКЛЮЧЕНИЯ!
                {ru: "делать, видеть - сильная perusmuoto",   fi: "tehdä, nähdä"},
                {ru: "делать, видеть - слабая minä",          fi: "teen, näen"},
                {ru: "делать, видеть - слабая sinä",          fi: "teet, näet"},
                {ru: "делать, видеть - сильная hän",          fi: "tekee, näkee"},
                {ru: "делать, видеть - слабая me",            fi: "teemme, näemme"},
                {ru: "делать, видеть - слабая te",            fi: "teette, näette"},
                {ru: "делать, видеть - сильная he",           fi: "tekevät, näkevät"},
            ]
        },
        {
            number: 10,
            comment: {ru: "Глаголы 3 типа.", fi: "Verbityyppi 3."},
            words: [
                {ru: "думать",                                  fi: "ajatella"},
                {ru: "представлять",                            fi: "esitellä"},
                {ru: "нащупывать, разузнавать",                 fi: "tunnustella"},
                {ru: "вращать, странствовать",                  fi: "kierrellä"},
                {ru: "улыбаться",                               fi: "hymyillä"},
                {ru: "прыгать, подпрыгивать",                   fi: "hypellä"},
                {ru: "ссориться",                               fi: "riidellä"},
                {ru: "работать, трудиться",                     fi: "työskennellä"},
                {ru: "решать",                                  fi: "ratkaista"},
                {ru: "слушать",                                 fi: "kuunnella"},
                {ru: "производить опыты, экспериментировать",   fi: "kokeilla"},
                {ru: "ходить пешком, гулять",                   fi: "kävellä"},
                {ru: "заикаться, спотыкаться",                  fi: "takellella"},
                {ru: "шить",                                    fi: "ommella"},
                {ru: "драться",                                 fi: "tapella"},
                {ru: "целоваться",                              fi: "suudella"},
                {ru: "горевать, печалиться",                    fi: "surra"},
                {ru: "бежать, бегать",                          fi: "juosta"},
                {ru: "положить, поставить",                     fi: "panna"},
                {ru: "учиться",                                 fi: "opiskella"},
            ],
            tests: [
                {ru: "бежать, положить, решать - сильная perusmuoto",      fi: "surra, panna, ratkaista"},
                {ru: "бежать, положить, решать - слабая minä",             fi: "suren, panen, ratkaisen"},
                {ru: "бежать, положить, решать - слабая sinä",             fi: "suret, panet, ratkaiset"},
                {ru: "бежать, положить, решать - сильная hän",             fi: "suree, panee, ratkaisee"},
                {ru: "бежать, положить, решать - слабая me",               fi: "suremme, panemme, ratkaisemme"},
                {ru: "бежать, положить, решать - слабая te",               fi: "surette, panette, ratkaisette"},
                {ru: "бежать, положить, решать - сильная he",              fi: "surevat, panevat, ratkaisevat"},

                {ru: "p",              fi: "pp"},
                {ru: "t",              fi: "tt"},
                {ru: "d",              fi: "t"},
                {ru: "rr",             fi: "rt"},


                {ru: "прыгать, думать, ссориться, вращать - сильная perusmuoto",   fi: "hypellä, ajatella, riidellä, kierrellä"},
                {ru: "прыгать, думать, ссориться, вращать - слабая minä",          fi: "hyppelen, ajattelen, riitelen, kiertelen"},
                {ru: "прыгать, думать, ссориться, вращать - слабая sinä",          fi: "hyppelet, ajattelet, riitelet, kiertelet"},
                {ru: "прыгать, думать, ссориться, вращать - сильная hän",          fi: "hyppelee, ajattelee, riitelee, kiertelee"},
                {ru: "прыгать, думать, ссориться, вращать - слабая me",            fi: "hyppelemme, ajattelemme, riitelemme, kiertelemme"},
                {ru: "прыгать, думать, ссориться, вращать - слабая te",            fi: "hyppelette, ajattelette, riitelette, kiertelette"},
                {ru: "прыгать, думать, ссориться, вращать - сильная he",           fi: "hyppelevät, ajattelevat, riitelevät, kiertelevät"},

                {ru: "nn",              fi: "nt"},
                {ru: "mm",              fi: "mp"},
                {ru: "ll",              fi: "lt"},

                {ru: "слушать, шить, заикаться - сильная perusmuoto",   fi: "kuunnella, ommella, takellella"},
                {ru: "слушать, шить, заикаться - слабая minä",          fi: "kuuntelen, ompelen, takeltelen"},
                {ru: "слушать, шить, заикаться - слабая sinä",          fi: "kuuntelet, ompelet, takeltelet"},
                {ru: "слушать, шить, заикаться - сильная hän",          fi: "kuuntelee, ompelee, takeltelee"},
                {ru: "слушать, шить, заикаться - слабая me",            fi: "kuuntelemme, ompelemme, takeltelemme"},
                {ru: "слушать, шить, заикаться - слабая te",            fi: "kuuntelette, ompelette, takeltelette"},
                {ru: "слушать, шить, заикаться - сильная he",           fi: "kuuntelevat, ompelevat, takeltelevat"},

                // ИСКЛЮЧЕНИЯ!
                {ru: "иметь, бегать - сильная perusmuoto",   fi: "olla, juosta"},
                {ru: "иметь, бегать - слабая minä",          fi: "olen, juoksen"},
                {ru: "иметь, бегать - слабая sinä",          fi: "olet, juokset"},
                {ru: "иметь, бегать - сильная hän",          fi: "on, juoksee"},
                {ru: "иметь, бегать - слабая me",            fi: "olemme, juoksemme"},
                {ru: "иметь, бегать - слабая te",            fi: "olette, juoksette"},
                {ru: "иметь, бегать - сильная he",           fi: "ovat, juoksevat"},
            ]
        },
    ]


};