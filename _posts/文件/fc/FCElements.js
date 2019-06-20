// figure_data------------------------------------------------------------------------
function figure_data()
{
	this.m_CPoint=new Array(FigureControl_MaxPointCount);
	for(var Index=0;Index<FigureControl_MaxPointCount;Index++)
		this.m_CPoint[Index]=new CPoint(0,0);
	
	this.nCPointCount=0;
	this.MaxPointCount=FigureControl_MaxPointCount;
	this.AddCPoint=AddCPoint;	
	this.ClearData=ClearData;
	this.eraseCPoint=eraseCPoint;
	this.InsertPoint=InsertPoint;
	this.InsertPointData=InsertPointData;
}

function AddCPoint(point)
{
	this.m_CPoint[this.nCPointCount].x=point.x;
	this.m_CPoint[this.nCPointCount].y=point.y;
	this.nCPointCount++;
}

function InsertPointData(point)
{
	if(this.nCPointCount<FigureControl_MaxPointCount)
	{		
		this.m_CPoint[this.nCPointCount].x=point.x;
		this.m_CPoint[this.nCPointCount].y=point.y;
		this.nCPointCount++;		
		return true;
	}	
	return false;
}

function InsertPoint(index)
{
	if(index>=0 && index<this.nCPointCount)
	{

		var begin=index;
		var end=index+1;

		if(index==maxValue(0,this.nCPointCount-1))
			end=0;
			
		var nMidValueX=(this.m_CPoint[begin].x+this.m_CPoint[end].x)/2;
		var nMidValueY=(this.m_CPoint[begin].y+this.m_CPoint[end].y)/2;

		for(var nindex=this.nCPointCount;nindex>index+1;nindex--)
		{
			this.m_CPoint[nindex].x=this.m_CPoint[nindex-1].x;
			this.m_CPoint[nindex].y=this.m_CPoint[nindex-1].y;
		}

		this.m_CPoint[index+1].x=nMidValueX;
		this.m_CPoint[index+1].y=nMidValueY;		
		
		this.nCPointCount++;
		return true;
	}
	else
		return false;	
}

function eraseCPoint(index)
{
	if(index>=0 && index<this.nCPointCount)
	{
		for(var nindex=index;nindex<this.nCPointCount;nindex++)
		{
			this.m_CPoint[nindex].x=this.m_CPoint[nindex+1].x;
			this.m_CPoint[nindex].y=this.m_CPoint[nindex+1].y;
		}
		this.nCPointCount--;
		return true;
	}
	else
		return false;	
}

function ClearData()
{
	for(var n=0;n<FigureControl_MaxPointCount;n++)
	{
		this.m_CPoint[n].x=0;
		this.m_CPoint[n].y=0;
	}	
	this.nCPointCount=0;
}
// ^figure_data------------------------------------------------------------------------


// figure------------------------------------------------------------------------
function Figure()
{
	this.figure_type=LineType;
	this.figure_color=NormalColor;
	this.figure_id=0;
	this.figure_name=null;
	this.figure_rect=new CRect(0,0,0,0);
	this.figure_rect_outside=new CRect(0,0,0,0);
	this.shift_x=0;
	this.shift_y=0;
	this.figure_color="rgb(0,255,0)";
	this.figure_fill=new FillFigureData(false,NormalColor,0);
		
	this.TransRate=100;   //图形透明度 0-100
	this.bShowSqure=false;
	this.bOutsideFigure=false;
	//图像数据
	this.figure_data=new figure_data;
	
	//function
	this.MoveFigure=MoveFigure;
	this.DistanceToData=DistanceToData;
	this.ClearFigureData=ClearFigureData;
}

function FillFigureData(b_fill,figure_color,FillStyle)
{
	this.b_fill=b_fill;
	this.figure_color=figure_color;
	this.FillStyle=FillStyle;
}


function MoveFigure(x,y)
{
	this.shift_x+=x;
	this.shift_y+=y;
	//console.log(x,y);
}


function DistanceToData(zoomData,Ftype)
{
	if (Ftype==DrectType)
	{
		this.figure_rect.left+=GetIntValue(this.shift_x/zoomData);
		this.figure_rect.right+=GetIntValue(this.shift_x/zoomData);
		this.figure_rect.top+=GetIntValue(this.shift_y/zoomData);
		this.figure_rect.bottom+=GetIntValue(this.shift_y/zoomData);

		this.figure_rect_outside.left+=GetIntValue(this.shift_x/zoomData);
		this.figure_rect_outside.right+=GetIntValue(this.shift_x/zoomData);
		this.figure_rect_outside.top+=GetIntValue(this.shift_y/zoomData);
		this.figure_rect_outside.bottom+=GetIntValue(this.shift_y/zoomData);
	}
	else if (Ftype==CircleType)
	{
		this.figure_rect.left+=GetIntValue(this.shift_x/zoomData);
		this.figure_rect.right+=GetIntValue(this.shift_x/zoomData);
		this.figure_rect.top+=GetIntValue(this.shift_y/zoomData);
		this.figure_rect.bottom+=GetIntValue(this.shift_y/zoomData);
	}
	else
	{
		var GetIndex=0;
		for (GetIndex;GetIndex<this.figure_data.nCPointCount;GetIndex++)
		{			
			this.figure_data.m_CPoint[GetIndex].x=this.figure_data.m_CPoint[GetIndex].x
			+GetIntValue(this.shift_x/zoomData);
			
			this.figure_data.m_CPoint[GetIndex].y=this.figure_data.m_CPoint[GetIndex].y
			+GetIntValue(this.shift_y/zoomData);
		}  
		if (Ftype==RectType)
		{
			this.figure_rect.left+=GetIntValue(this.shift_x/zoomData);
			this.figure_rect.right+=GetIntValue(this.shift_x/zoomData);
			this.figure_rect.top+=GetIntValue(this.shift_y/zoomData);
			this.figure_rect.bottom+=GetIntValue(this.shift_y/zoomData);
		}
	}

	this.shift_x=0;
	this.shift_y=0;
}


function ClearFigureData()
{
	this.figure_data.ClearData();	
	this.figure_rect.left=0;
	this.figure_rect.right=0;
	this.figure_rect.top=0;
	this.figure_rect.bottom=0;
	this.figure_rect_outside.left=0;
	this.figure_rect_outside.right=0;
	this.figure_rect_outside.top=0;
	this.figure_rect_outside.bottom=0;
	this.figure_id=0;
	this.TransRate=0;
	this.figure_name="";
	this.shift_x=0;
	this.shift_y=0;
	this.TransRate=0;
	this.figure_fill.b_fill=false;
	this.bShowSqure=false;
	this.bOutsideFigure=false;
}
// ^figure------------------------------------------------------------------------

//FiguresSet-----------------------------------------
function FiguresSet()
{
	//attibutes
	this.m_Figures=new Array(FigureControl_MaxPointCount);	
	
	for(Index=0;Index<50;Index++)
	this.m_Figures[Index]=new Figure();
	
	this.m_nFigureCount=0;
	//operations
	this.AddFigure=AddFigure;	
	this.ClearFigureSetData=ClearFigureSetData;
}

function AddFigure(figure)
{
	this.m_Figures[this.m_nFigureCount]=cloneObj(figure);
	this.m_nFigureCount++;
}

function ClearFigureSetData()
{
	for(var n=0;n<FigureControl_MaxFigureCount;n++)
	{
		this.m_Figures[n].ClearData();
	}	
	this.m_nFigureCount=0;
}
//^FiguresSet-----------------------------------------


//FiguresRectSet---------------------------------------
function FiguresIDSet()
{
//attibutes
	this.m_FigureIDArray=new Array(FigureControl_MaxPointCount);		
	this.m_nFigureRectCount=0;
//operations	
	this.AddFiguretRect=AddFiguretRect;	
	this.ClearFigureRectData=ClearFigureRectData;
}


function AddFiguretRect(nid)
{
	this.m_FigureIDArray[this.m_nFigureRectCount]=nid;
	this.m_nFigureRectCount++;
}

function ClearFigureRectData()
{
	for(var n=0;n<FigureControl_MaxFigureCount;n++)
	{
		this.m_FigureIDArray[n]=0;
	}	
	this.m_nFigureRectCount=0;
}

//^FiguresRectSet----------------------------------------------------------


