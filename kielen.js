"use strict";

$(document).ready(function () {

    app.init();

});

var app = {

    settings: {
        theme: "tiukka",
        mode: "dict",
        size: 20
    },

    init: function() {

        var self = this;

        // Подключаем блок данных
        self.course = data.fi;

        self.mode = self.settings.mode;
        self.size = self.settings.size;

        self.buildIndex();
        self.initButtons();
        self.displayMode();
        self.initInputsWords();
        self.initInputsTests();
        self.initInputsDict();
        self.activateTheme();

    },
    
    activateTheme: function() {
        var self = this;
        $("<link/>", {
            rel: "stylesheet",
            type: "text/css",
            href: self.settings.theme + ".css"
        }).appendTo("head");
    },

    initInputsDict: function() {
        var self = this;
        $(".main").on("change", ".dict-panel input", function() {

            var question = self.test.sequence[self.test.index].data.ru;
            var answer = self.test.sequence[self.test.index].data.fi;
            var value = $(this).val();
            var tip = $(".main .dict-panel .tip");
            var dict_word = $("#dict-word-" + self.test.index);
            var dict_panel = $(".dict-panel");

            tip.text(self.test.sequence[self.test.index].data.fi);

            if (value === answer) {

                /* Правильный ответ */

                tip.hide();
                dict_word.html("<span class='glyphicon glyphicon-ok-sign'></span>");

                if (self.test.counter < 3) {
                    dict_word.removeClass("pending").addClass("good");
                }

                self.test.counter = 0;

                if (self.test.index == (self.test.len - 1)) {
                    switch (self.test.result) {
                        case "fail":
                            dict_panel.html("<span class='result label label-danger'>Тест не пройден</span>");
                            break;
                        case "so-so":
                            var learner_button = "";
                            if (self.learn.data.length) {
                                learner_button = "<button name='learner' class='btn btn-default'>Повторить слова</button>";
                            }
                            dict_panel.html("<span class='result label label-warning'>Тест частично пройден</span>"
                                + learner_button);
                            break;
                        case "good":
                        default:
                            dict_panel.html("<span class='result label label-success'>Тест пройден</span>");
                            break;
                    }
                } else {
                    self.test.index ++;
                }

            } else {

                /* Неправильный ответ */

                switch (self.test.counter) {
                    case 0:
                    case 1:
                        // Две первые попытки - без последствий
                        self.test.counter++;
                        break;
                    case 2:
                        // Третья попытка - вывод подсказки и фиксация слова для повторения
                        self.learn.data.push(self.test.index);
                        tip.show();
                        dict_word.html("<span class='glyphicon glyphicon-exclamation-sign'></span>");
                        dict_word.removeClass("pending").addClass("so-so");
                        self.test.result = 'so-so';
                        self.test.counter++;
                        break;
                    case 3:
                        // Четвертая ошибка - тест провален (хотя для чего этот статус? возможно, потом уберу его)
                        tip.hide();
                        dict_word.html("<span class='glyphicon glyphicon-remove-sign'></span>");
                        dict_word.removeClass("pending").removeClass("so-so").addClass("fail");
                        self.test.counter = 0;
                        self.test.result = "fail";
                        self.test.index ++;
                        break;
                }

            }

            $(".main .dict-panel .question").text(self.test.sequence[self.test.index].data.ru);
            $(".main .dict-panel input[name=answer]").val('');
        });
    },

    processLearner: function() {
        var self = this;
        var content = "";
        var word = {};
        var main = $(".main");
        self.learn.counter = 5;

        content = "<table class='learner-list'><tr><th class='i'>N</th><th class='src'>ru</th><th class='dst'>fi</th><th class='result'></th></tr>";

        self.learn.data.forEach(function(index, i, data){

            word = self.test.sequence[index].data;

            content += "<tr class='i_" + i + "'>"
                        + "<td><span class='label label-success'>" + (i + 1) + "</span></td>"
                        + "<td class='question'>" + word.ru + "</td>"
                        + "<td class='answer'><input class='learner' type='text' data-answer='" + word.fi + "'/></td>"
                        + "<td class='result'></td>"
                    + "</tr>";
        });
        content += "</table>";
        main.html(content);
        $(".learner-list tr.i_0 input").focus();
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
                    + self.course[number].words[i].fi + "'></span>");
            }
        });
    },

    checkWord: function(object) {
        var self = this;
        var value = object.value;
        var number = $(object).attr("data-number");
        var i = $(object).attr("data-i");
        var result = false;

        var word = self.course[number].words[i].fi;

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
                    + self.course[number].tests[i].fi + "'></span>");
            }
        });
    },

    checkTest: function(object) {
        var self = this;
        var value = object.value;
        var number = $(object).attr("data-number");
        var i = $(object).attr("data-i");
        var result = false;

        var word = self.course[number].tests[i].fi;

        if (value === word) {
            result = true;
        }

        return result;
    },

    displayMode: function() {
        var self = this;
        var button_mode = self.mode === "dict" ? self.mode + self.size : self.mode;
        $("button.mode-selector").css("border", "none");

        $("button[name=" + button_mode + "_mode]").css("border", "2px solid black");

        if (self.random) {
            $("button[name=random]").css("border", "2px solid black");
        } else {
            $("button[name=random]").css("border", "none");
        }
    },

    processPart: function(object, entity) {
        var self = this;
        var number = $(object).attr("data-number") - 1;
        var part = self.course[number];
        var data = self.course[number][entity];
        var content = "";
        var main = $(".main");
        var first_answer = "input[name=answer_0]";

        switch(self.mode) {

            case "view":
                data.forEach(function(el, i, data){
                    content += "<div class='terms view'>";
                    content += "<div class='number'>" + (i + 1) + "</div><div id='question_" + i + "' class='question'>" + el.ru + "</div>"
                    + "<div class='answer'><input name='answer_" + i + "' data-tip='" + el.fi + "' data-i='" + i + "' placeholder='" + el.fi + "' /></div>";
                    content += "</div>";
                });
                main.html(content);
                $(first_answer).focus();
                break;

            case "test":
                data.forEach(function(el, i, data){
                    content += "<div class='terms view'>";
                    content += "<div class='number'>" + (i + 1) + "</div><div id='question_" + i + "' class='question'>" + el.ru + "</div>"
                        + "<div class='answer'><input name='answer_" + i + "' data-tip='" + el.fi + "' data-i='" + i + "' /></div>";
                    content += "</div>";
                });
                main.html(content);
                $(first_answer).focus();
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
        self.mode = $(object).attr("data-mode");
        self.size = $(object).attr("data-size");
        self.buildIndex();
        self.displayMode();
    },

    initButtons: function() {
        var self = this;
        $(".index")
            .on("click", ".words span", function() {self.processPart(this, "words");})
            .on("click", ".tests span", function() {self.processPart(this, "tests");})
            .on("click", ".dicts span", function() {self.processDict(this); $(".dict-panel input").focus(); });
        $(".mode-selector").on("click", function() {self.selectMode(this, self);});
        $(".random").on("click", function() {self.switchRandom();});
        $("button[name=debug]").on("click", function() {self.processDebug();});
        $(".main").on("click", "button[name=learner]", function() {self.processLearner();})
            .on("change", ".answer input", function() {self.processRetype(this);});
    },

    processRetype: function(object) {
        var self = this;
        var i = $(object).attr('data-i');
        var question = $("#question_" + i).text();
        var answer = $(object).val();
        var tip = $(object).attr("data-tip");

        if (answer == tip) {
            i++;
            console.log("YES");
            $(object).removeClass("incorrect").addClass("correct");
            var next = $("input[name=answer_" + i + "]");

            if (next.length) {
                next.focus();
            } else {
                $(".answer input").val("").removeClass("correct").removeClass("incorrect");
                $("input[name=answer_0]").focus();
            }
        } else {
            $(object).removeClass("correct").addClass("incorrect");
        }

    },

    switchRandom: function() {
        var self = this;
        if (self.random) {
            self.random = 0;
        } else {
            self.random = 1;
        }
        self.displayMode();
        self.buildIndex();
    },

    processDict_bak: function(object) {
        var self = this;
        var main = $(".main");
        var number = $(object).attr('data-number');
        var len = $(object).attr('data-len');

        self.test.sequence = self.dictionary[number];
        self.test.len = len;
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

    processDict: function(object) {
        var self = this;
        var main = $(".main");
        var number = $(object).attr("data-number");
        var len = $(object).attr('data-len');

        self.test.sequence = self.dictionary[number];
        self.test.len = len;
        self.test.index = 0;
        self.test.counter = 0;
        self.test.fail = 0;
        self.test.good = 0;
        self.test.result = 'process';

        var content = "";
        var first_answer = "input[name=answer_0]";

        self.test.sequence.forEach(function(el, i, data){
            content += "<div class='terms dict'>";
            content += "<div class='number'>" + (i + 1) + "</div><div id='question_" + i + "' class='question'>" + el.data.ru + "</div>"
                + "<div class='answer'><input name='answer_" + i + "' data-tip='" + el.data.fi + "' data-i='" + i + "' placeholder='" + el.data.fi + "' /></div>";
            content += "</div>";
        });
        main.html(content);
        $(first_answer).focus();
    },

    buildIndex: function() {

        var self = this;
        var index = $(".index");
        var main = $(".main");
        var content = "";

        main.html("");

        switch(self.mode) {

            case "course":

                // Содержание для тестирования по разделам

                self.course.forEach(function(part, i, course) {

                    content += "<div class='course'>";

                    content += "<div class='number'>" + (i + 1) + "</div>";

                    content += "<div class='comment'>" + part.comment.ru + "</div>";

                    content += "<div class='words'>";
                    if (part.words.length > 0) {
                        content += "<span data-number='" + part.number + "'>" + part.words.length + "</span>";
                    }
                    content += "</div>";

                    content += "<div class='tests'>";
                    if (part.tests.length > 0) {
                        content += "<span data-number='" + part.number + "'>" + part.tests.length + "</span>";
                    }
                    content += "</div>";

                    content += "</div>";
                });
                //content += "</table>";
                break;

            case "dict":

                // Содержание для тестирования по словарю

                self.buildDictionary();

                self.dictionary.forEach(function(selection, s, selections){

                    content += "<div class='dicts'>";

                    content += "<div class='number'><span data-number='" + s + "'>" + selection[0].index + "..." + selection[self.size - 1].index + "</span></div>";

                    content += "<div class='comment'><span data-number='" + s + "'>" + selection[0].data.ru + " ... " + selection[self.size - 1].data.ru + "</span></div>";

                    content += "</div>";
                });
                break;

            default:
                break;
        }
        index.html(content);

    },

    buildDictionary: function() {
        var self = this;
        var i = 0;
        var j = 0;
        self.dictionary = [];
        var selection = [];
        var list = [];

        self.course.forEach(function(part, p, course) {
            part.words.forEach(function(word, w, words){
                list[i++] = {
                    part: p,
                    word: w,
                    data: word
                };
            });
        });

        i = 0;

        if (self.random) {
            list = self.shuffle(list);
        }

        list.forEach(function(el, e, list){
             selection[j] = {
                 part: el.part,
                 word: el.word,
                 data: el.data,
                 index: (i * self.size + j + 1)
             };
            if (++j >= self.size) {
                self.dictionary[i] = selection;
                selection = [];
                j = 0;
                i++;
            }
        });

    },

    shuffle: function(arr) {

        var currentIndex = arr.length, temporaryValue, randomIndex;

        // While there remain elements to shuffle...
        while (0 !== currentIndex) {

            // Pick a remaining element...
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;

            // And swap it with the current element.
            temporaryValue = arr[currentIndex];
            arr[currentIndex] = arr[randomIndex];
            arr[randomIndex] = temporaryValue;
        }
        return arr;
    },

    learn: {
        data: [],
        counter: 5
    },

    mode: "view",

    size: 20,

    random: 0,

    test: {
        sequence: [],
        len : 0,
        index: 0,
        counter: 0,
        words: 0,
        fail: 0,
        good: 0,
        result: 'good'
    },

    dictionary: [],

    course: null

};