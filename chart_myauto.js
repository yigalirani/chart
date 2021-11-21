function myauto_set(id,selection_array){
    var num_items=0;
    var choices=null;
    var input=null;
    var col=null
    var sort=null
    var filtered=[]
    var on_update=function(){} //will be overriden later
    function trim(s){ 
      return ( s || '' ).replace( /^\s+|\s+$/g, '' ); 
    }   
    function sort_it(a){
        if (!col)
            return a
        function compare2(a,b) {
          if (a[col] < b[col])
            return -1;
          if (a[col] > b[col])
            return 1;
          return 0
        }
        function compare(a,b) {
            ans=compare2(a,b)
            if (sort=='desc')
                return -ans
            return ans
        }
        return a.concat().sort(compare);        
    }
    function check_clicker(event){
        src=event.srcElement
        ord=parseInt(src.getAttribute('ord'))
        selection_array[ord].disabled=!src.checked
        render()
    }
    function is_all(items,value){
        for (i=0;i<items.length;i++)
            if (items[i].disabled!=value)
                return false
        return true;
    }
    function calc_checkbox(id,items){
        var all_false=is_all(items,false);
        var all_true=is_all(items,true);
        elem=document.querySelector(id)
        elem.indeterminate=false
        if (all_false){
            elem.checked=true
            return
        }
        if (all_true){
            elem.checked=false
            return
        }
        elem.indeterminate=true
        elem.checked=true
    }
    function render(){ //also updates the selectde_item
        num_items=0;
        choices.style.display='none';         
        var pattern=input.value;
        //document.querySelector('#clearcat').style.display = pattern ? 'inline-block':'none'
        var html="";
        var re = new RegExp("(" + pattern + ")", "gi");
        var line=0
        var count=0
        var sorted_array=sort_it(selection_array,col,sort)
        filtered=[]
        for (var i=0;i<sorted_array.length;i++){
            var item=sorted_array[i];
            if (trim(pattern)!=''&&!item.key.match(re))
                continue;
            filtered.push(item)
            key=item.key
            if (trim(pattern)!='')
                key=key.replace(re,"<b>$1</b>")
            count++    
            checke=""
            if (!item.disabled)
                checke="checked"
            row='<tr ><td class=title>'+count+'</td>'
            +'<td style="background:'+item.color+';"><input  type="checkbox" '+checke+' ord="'+item.ord+'"/> </td>'
            +'<td>'+key+'</td>'
            +'<td>'+item.total+'</td>'
            +'<td>'+item.max+'</td>'
            +'<td>'+item.points+'</td>'
            +'</tr>';
            html+=row
        }
        if (filtered.length!=sorted_array.length){
            html+='<td><td colspan=5>Showing '+filtered.length+' of '+sorted_array.length+' entries <a href=# id =clearcat>clear filter</a></td></tr>' 
        }

        choices.innerHTML=html;
        choices.style.display='table-row-group'; 
        document.querySelectorAll('[ord]').forEach(function (el){
                el.onclick=check_clicker;
            }) 
        calc_checkbox('#checkall',selection_array)
        calc_checkbox('#checkvisible',filtered)   
        var clearcat=document.querySelector('#clearcat')
        if (clearcat)
            clearcat.onclick=function(){
                document.querySelector('#category').value = ""
                render()
            }        
        on_update()       
    }
    function clear_dom_sort(){
        document.querySelectorAll('[col]').forEach(function (el){
                el.removeAttribute('sort')
            })        
    }
    function clearsort_click(event){
        clear_dom_sort();
        set_sort(null,null)
    }
    function set_sort(_col,_sort){
        sort=_sort;
        col=_col;
        render()
    }
    function sorter_click(event){
        function calc_sort(sort){
            if (!sort || sort=='asc')
                return 'desc'
            return 'asc'
        }     
        var src=event.srcElement   
        var col=src.getAttribute('col')
        if (col){
            var sort=calc_sort(src.getAttribute('sort'))
            clear_dom_sort();
            src.setAttribute('sort',sort)
            set_sort(col,sort)
        }
    }
    function init(){    
        selection_array.forEach((item,i)=>item.ord=i)

        input=document.querySelector('#category');
        choices=document.querySelector("#"+id+' tbody');
        input.onkeyup=function(event){
            if ([40,38,27,13].indexOf(event.keyCode)!=-1)
                return;
            render();
        }
        document.querySelectorAll('.sorter').forEach(el=>el.onclick=sorter_click)
        document.querySelector('#clearsort').onclick=clearsort_click

        document.querySelector('#checkall').onclick=function(event){
            selection_array.forEach(item=>item.disabled=!event.srcElement.checked)
            render()            
        }
        document.querySelector('#checkvisible').onclick=function(event){
            filtered.forEach(item=>item.disabled=!event.srcElement.checked)
            render()        
        }

    }
    init();
    render();
    return {
        set_on_update(_on_update){
            on_update=_on_update;
        }
    }
}