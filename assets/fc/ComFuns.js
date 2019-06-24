
//Common Functions--------------------------------

function PointEqual(PointA,PointB)
{
	PointA.x=PointB.x;
	PointA.y=PointB.y;
}

 
function PointInCurrentRect(rect,point)
{
	if (point.x>=rect.left && point.x<=rect.right && point.y>=rect.top && point.y<=rect.bottom)
	{
		return true;
	}
	else
	{
		return false;
	}
}

function GetIntValue(fdata)
{
	if (fdata >=0)
	{
		return parseInt(fdata+0.5);
	}
	else
		return parseInt(fdata-0.5);
}

function isClass(o){
    if(o===null) return "Null";
    if(o===undefined) return "Undefined";
    return Object.prototype.toString.call(o).slice(8,-1);
}

function  cloneObj(obj){   
	var result,oClass=isClass(obj);
        //确定result的类型
    if(oClass==="Object"){
        result={};
    }else if(oClass==="Array"){
        result=[];
    }else{
        return obj;
    }
    for(key in obj){
        var copy=obj[key];
        if(isClass(copy)=="Object"){
            result[key]=arguments.callee(copy);//递归调用
        }else if(isClass(copy)=="Array"){
            result[key]=arguments.callee(copy);
        }else{
            result[key]=obj[key];
        }
    }
    return result;
}

function  maxValue(a,b)
{
	return a>b?a:b;
}


function minValue(a,b)
{
	return a<b?a:b;
}







//Cpoint  Defines-----------------------------------------------------------------------------
function CPoint(x,y)
{
	this.x=x;
	this.y=y;
}
//^Cpoint  Defines-----------------------------------------------------------------------------


//CRect  Defines-----------------------------------------------------------------------------
function CRect(left,top,right,bottom)
{
	this.left=left;
	this.top=top;
	this.right=right;
	this.bottom=bottom;
	
	this.Width=Width;
	this.Height=Height;
	this.GetCenter=GetCenter;
}


function Width()
{
	return this.right-this.left;
}

function Height()
{
	return this.bottom-this.top;
}

function GetCenter()
{
	var CenterPoint=new CPoint(0,0);
	CenterPoint.x=this.left+GetIntValue(this.Width()/2.0);
	CenterPoint.y=this.top+GetIntValue(this.Height()/2.0);
	return CenterPoint;
}
//^CRect  Defines-----------------------------------------------------------------------------

function GetBrowserPosition(element)
{ 
	var t=element.offsetTop; 
	var l=element.offsetLeft; 
	var w=element.offsetWidth;
	var h=element.offsetHeight;
	while(element=element.offsetParent)
	{ 
		t+=element.offsetTop; 
		l+=element.offsetLeft; 
	} 
	
	var Rect=new CRect(l,t,l+w,t+h);
	return Rect;
}

function InSubFigureRect(point,beginPoint,endPoint)//点是否在直接指定范围内
{
	var k=0.0;//直线斜率
	if (endPoint.x-beginPoint.x!=0)
	{
		k=((endPoint.y-beginPoint.y)*1.0/(endPoint.x-beginPoint.x));
	}
	else
		k=0;
	var y=GetIntValue((k*(point.x-endPoint.x)))+endPoint.y;
	if ( y>=point.y && point.x>=minValue(endPoint.x,beginPoint.x)  && point.x<maxValue(endPoint.x,beginPoint.x)) 
	{
		return true;
	} 
	else
	{
		return false;
	}
}

function InEllipseRect(rect,point)//点是否在圆区域内
{
	var a=0.0,b=0.0, x0=0.0,y0=0.0; 
	//椭圆焦点在X轴上
	if (rect.Width()>=rect.Height())
	{
		a=maxValue(GetIntValue(rect.Height()/2.0),GetIntValue(rect.Width()/2.0));
		b=minValue(GetIntValue(rect.Height()/2.0),GetIntValue(rect.Width()/2.0));
		x0=GetIntValue(rect.right-rect.Width()/2.0);  
		y0=GetIntValue(rect.bottom-rect.Height()/2.0); 
		var tempvalue=0.0;
		tempvalue=Math.pow(b,2)-Math.pow(b/a,2)*Math.pow((point.x-x0),2);
		if (tempvalue<0)
		{
			return false;
		}
		tempvalue=Math.pow(tempvalue,0.5);
		var y1=0.0,y2=0.0;
		y1=y0+tempvalue;
		y2=y0-tempvalue;
		if ((y1>=point.y&& y2<=point.y) || (y1<=point.y && y2>=point.y))
		{
			return true;
		}
		else
		{
			return false;
		}
	}
	else//椭圆焦点在Y轴上
	{
		a=maxValue(GetIntValue(rect.Height()/2.0),GetIntValue(rect.Width()/2.0));
		b=minValue(GetIntValue(rect.Height()/2.0),GetIntValue(rect.Width()/2.0));
		x0=GetIntValue((rect.right-rect.Width()/2.0));  
		y0=GetIntValue((rect.bottom-rect.Height()/2.0)); 
		var tempvalue=0.0;
		tempvalue=Math.pow(a,2)-Math.pow(a/b,2)*Math.pow((point.x-x0),2);
		if (tempvalue<0)
		{
			return false;
		}
		tempvalue=Math.pow(tempvalue,0.5);
		var y1=0.0,y2=0.0;
		y1=y0+tempvalue;
		y2=y0-tempvalue;
		if ((y1>=point.y&& y2<=point.y) || (y1<=point.y && y2>=point.y))
		{
			return true;
		}
		else
		{
			return false;
		}
	}
}




function PointInPointRect(pt,rect_point)  //A点是否在B点区域范围内
{
	var rect=new CRect(0,0,0,0);
	var RectSize=FigureControl_PointRectDistance;
	rect.left=rect_point.x-RectSize;
	rect.right=rect_point.x+RectSize;
	rect.top=rect_point.y-RectSize;
	rect.bottom=rect_point.y+RectSize;
	if (PointInRect(pt,rect))
	{
		return true;
	}
	else
	{
		return false;
	}
}

function PointInRect(point ,rect)  //点是否在方框区域内
{
	if (point.x>=rect.left && point.x<=rect.right && point.y>=rect.top && point.y<=rect.bottom)
	{
		return true;
	}	 
	else
		return false;
}

function PointInRectEdge(point,rect,num)// 点是否在方框边缘区域内
{
	if (point.x<=rect.left && point.y<=rect.top && num==LeftTop)
	{
		return true;
	}
	else if (point.x>=rect.right && point.y<=rect.top && num==RightTop)
	{
		return true;
	}
	else if (point.x>=rect.right && point.y>=rect.bottom && num==RightBottom)
	{
		return true;
	}
	else if (point.x<=rect.left && point.y>=rect.bottom&& num==LeftBottom)
	{
		return true;
	}
	else
	{
		return false;
	}
}


function deepCompare(a, b) {
	var obj1=new FiguresSet;
	var obj2=new FiguresSet;
	obj1=cloneObj(a);
	obj2=cloneObj(b);

	if(obj1.m_nFigureCount!=obj2.m_nFigureCount)
	return false;
	for(var index=0;index<obj1.m_nFigureCount;index++)
	{
		if(obj1.m_Figures[index].figure_type!=obj2.m_Figures[index].figure_type)
		return false;

		if(obj1.m_Figures[index].figure_name!=obj2.m_Figures[index].figure_name)
		return false;

		if(obj1.m_Figures[index].figure_rect.left!=obj2.m_Figures[index].figure_rect.left
			|| obj1.m_Figures[index].figure_rect.top!=obj2.m_Figures[index].figure_rect.top
			|| obj1.m_Figures[index].figure_rect.right!=obj2.m_Figures[index].figure_rect.right
			|| obj1.m_Figures[index].figure_rect.bottom!=obj2.m_Figures[index].figure_rect.bottom)
		return false;

		if(obj1.m_Figures[index].figure_rect_outside.left!=obj2.m_Figures[index].figure_rect_outside.left
			|| obj1.m_Figures[index].figure_rect_outside.top!=obj2.m_Figures[index].figure_rect_outside.top
			|| obj1.m_Figures[index].figure_rect_outside.right!=obj2.m_Figures[index].figure_rect_outside.right
			|| obj1.m_Figures[index].figure_rect_outside.bottom!=obj2.m_Figures[index].figure_rect_outside.bottom)
		return false;

		for(var ptIndex=0;ptIndex<obj1.m_Figures[index].figure_data.m_CPoint;ptIndex++)
		{
			if(obj1.m_Figures[index].figure_data[ptindex].x!=obj2.m_Figures[index].figure_data[ptindex].x
			|| obj1.m_Figures[index].figure_data[ptindex].y!=obj2.m_Figures[index].figure_data[ptindex].y)
			return false;
		}
	}

	return true;
}