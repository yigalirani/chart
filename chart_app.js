(function(){
    var httpRequest = new XMLHttpRequest();
    var myauto=null

    function transform(obj){
        function transform_entry(name,values,color){
            var len = values.length;
            var max=0;
            var total=0;
            for (var i = 0; i < len; i++) { 
                var point=values[i];
                value=point.value;
                max=Math.max(max,value)
                total+=value
            }       
            return {key:name,total:total,max:max,points:len,disabled:false,values:values,disabled:false,color:color}
        }        
        obj=obj['data']
        ans=[]
        colors=d3.scale.category20()
        i=0
        for (var name in obj) {
            i++
            if(!obj.hasOwnProperty(name)) continue;
            color=colors(i%20)
            ans.push(transform_entry(name,obj[name],color))
        }
        return ans;
    }

    function activate_myauto(cat){
        function show_selection_with_alert(selected){
            alert(selected)
        }       
   

        return myauto_set('myauto_demo',cat);
    }
    function activate_chart(cat){
        nv.addGraph(function() {
          var chart = nv.models.lineChart()
            .useInteractiveGuideline(false)
            .x(function(d) { return d.time })
            .y(function(d) { return d.value })
            .showLegend(false)
          //  .width(800).height(400);

         chart.xAxis
            .tickFormat(function(d) {
              return d3.time.format('%x')(new Date(d))
            });
          
          d3.select('#chart svg')
            .datum(cat)
            .transition().duration(500)
            .call(chart)
            ;

          nv.utils.windowResize(chart.update);
          myauto.set_on_update(chart.update)
          return chart;
        });


    }

    httpRequest.onreadystatechange = function(){
        if (httpRequest.readyState!=4)
            return;
        var cat = JSON.parse(httpRequest.responseText) ;;//no var decleration so it it global
        cat=transform(cat);
        myauto=activate_myauto(cat)
        activate_chart(cat)
    }

    httpRequest.open('GET','cat_anon.json', true);
    httpRequest.send(null);
})()