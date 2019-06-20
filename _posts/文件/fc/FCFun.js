

//FigureCntrol internal Functinos---------------------------------------------------------------
function InitFigureControl()  //初始化控件参数
{
	this.m_fZoomNum=1;  //图形放大倍数   
	this.m_cpCurrentPoint_cursor.x=0;  //当前鼠标位置
	this.m_cpCurrentPoint_cursor.y=0;
	this.m_cpOriginalPoint_cursor.x=0;  //最近一次鼠标左键点击的位置
	this.m_cpOriginalPoint_cursor.y=0;
	this.m_cpDistancePoint.x=0;         //左键点击鼠标后偏移的位置
	this.m_cpDistancePoint.y=0;
	this.OriginalPoint_Bitmap.x=0;//50;    //坐标原点位置
	this.OriginalPoint_Bitmap.y=0;//10; 
	this.m_MovePoint_cursor.x=0;   //当前鼠标移动到的位置
	this.m_MovePoint_cursor.y=0; 
	
	this.m_CurrentDistance.x=0;  //坐标平移距离
	this.m_CurrentDistance.y=0;
	this.m_nCursorInFigureId=0;  //鼠标所在图形ID
	this.SelectFigureId=0;
	this.m_nNextFigureIndex=0;
	
	this.m_nScrollRate=0;
	this.CurrentFigure.shift_x=0;
	this.CurrentFigure.shift_y=0;
	this.m_CurrentFillStyle=0;

	this.m_PositionLabel.x=0;
	this.m_PositionLabel.y=0;
	this.m_RectFigure.top=0;
	this.m_RectFigure.bottom=0;
	this.m_RectFigure.right=0;
	this.m_RectFigure.left=0;  
	this.m_ClientRect.top=0;
	this.m_ClientRect.bottom=0;
	this.m_ClientRect.left=0;
	this.m_ClientRect.right=0;
	this.x_Distance=0;
	this.y_Distance=0;

	this.b_SubFiguresMove=false;  //是否移动图形形
	this.b_SubFiguresZoom=false;    //释放缩放图形 
	this.b_LButtonDouC=false;   //是否还处于左键双击状态
	this.b_DrawCircle=false;
	this.b_DrawDoubleRect=false;
	this.b_DrawPoly=false;
	this.b_DrawRect=false;
	this.b_PreDrawRect=false;   //准备绘制方框
	this.b_PreDrawCircle=false;
	this.b_PreDrawDoubleRect=false;  
	this.b_FigurePointSelect=false;
	this.b_ChangeFigureValue=false; 
	this.b_InitShiftToCenter=true;
	this.b_ShowPositionLabel=false;
	this.b_LeftButtonDown=false;
	this.b_LoadData=false;
	this.b_ChangeFigureSize=true;
	this.b_ChooseDRectType=false;	
	this.b_ProcessImageFromDc=false;
	this.b_CursorInOutSide=true;
	this.m_bRGBBufferFill=false;
	this.b_ShowPointRect=true;
	this.b_MoveAllFigures=false;
	this.bFitFigureSize=false;
	
	if (this.m_SelectSubFigureRectIdSet.m_nFigureRectCount>0)
	{
		this.m_SelectSubFigureRectIdSet.ClearFigureRectData();
	}
	if (this.m_TempLinesPointSet.nCPointCount>0)
	{
		this.m_TempLinesPointSet.ClearData();
	}
	if (this.m_FiguresSet.m_nFigureCount>0)
	{
		this.m_FiguresSet.ClearFigureSetData();
	}
	
	this.m_TransparentBackgroundColor=0;
	this.m_nControlWidth=0;
	this.m_nControlHeight=0;
	this.FinishDrawNotice=null;
	this.m_csCurrentDrawFigureName="";
	this.m_OutsideLineColor="#ffffff";
	this.b_ShowOutSideLine=false;	
	
	return true;  
} 


//从文件导入数据
//BOOL  LPCTSTR FilePath,CPoint pt,COLORREF ImgColor=RGB(255,0,0),float ZoomData=0, BOOL bEnableEvent=FALSE
function InitFigureControlFromFile(ImageName)
{
	this.InitFigureControl();
	var Rect=GetBrowserPosition(this.m_Canvas);	
	this.x_Distance=Rect.left;
	this.y_Distance=Rect.top;

	this.m_ClientRect.left=0;
	this.m_ClientRect.top=0;
	this.m_ClientRect.bottom=Rect.Height();
	this.m_ClientRect.right=Rect.Width();

	this.b_LoadData=true;
	
	var parentControl=this;
	this.m_Image.onload=function(){	

		parentControl.SetFitFillControl();
		parentControl.ShiftImageToCenter();	
  }   
	
	
	this.m_Image.src=ImageName; 	

	//鼠标缩放
	this.m_Canvas.onmousewheel=this.m_Canvas.onwheel=function(event){
		var pt=new CPoint(event.clientX,event.clientY);
		parentControl.MouseWheel(event.wheelDelta,pt);
		parentControl.RepaintControl();
	}	
		
	//鼠标双击左键	
	this.m_Canvas.ondblclick=function()
	{
		if(event.button==0)
		{
			var pt=new CPoint(event.clientX,event.clientY);		
			parentControl.LButtonDblClk(pt);
		}		
	}

	//鼠标按下左键
	this.m_Canvas.onmousedown=function(event){	
		
		if(event.button==0)
		{
			var pt=new CPoint(event.clientX,event.clientY);
			parentControl.m_bMouseClickFlag=true;
			parentControl.LButtonDown(pt);		
		}

		if(event.button==2)
		{
			var pt=new CPoint(event.clientX,event.clientY);				
			parentControl.RButtonDown(pt);	
			parentControl.m_Canvas.onmousemove=null;
			parentControl.m_Canvas.onmouseup=null;
			parentControl.m_Canvas.style.cursor="default";
		//	event.stopPropagation();
		}
		
		//鼠标移动
		parentControl.m_Canvas.onmousemove=function(event)
		{
			parentControl.m_Canvas.style.cursor="move";
			var pt=new CPoint(event.clientX,event.clientY);		  
			parentControl.MouseMove(pt);
		}

	    //鼠标松开左键	
		parentControl.m_Canvas.onmouseup=function(event)
		{
			if(event.button==0)
			{
				parentControl.m_bMouseClickFlag=false;
				var pt=new CPoint(event.clientX,event.clientY);
			
				parentControl.LButtonUp(pt);
				//parentControl.m_Canvas.onmousemove=null;
				parentControl.m_Canvas.onmouseup=null;
				parentControl.m_Canvas.style.cursor="default";
				event.stopPropagation();

				//鼠标移动
				parentControl.m_Canvas.onmousemove=function(event)
				{
					var pt=new CPoint(event.clientX,event.clientY);	  
					parentControl.MouseMove(pt);
				}			
			}		
		}			
	}
	

	//鼠标移动
	this.m_Canvas.onmousemove=function(event)
	{
		var pt=new CPoint(event.clientX,event.clientY);	  
		parentControl.MouseMove(pt);
	}	

}
	
//未初始化，用当前环境显示
//BOOL  LPCTSTR FilePath
function LoadImageFromFile(ImageName)
{		
	var parentControl=this;
	this.m_Image.onload=function(){	

		parentControl.RepaintControl();
  }   
	this.m_Image.src=ImageName; 	
}			


function RepaintControl() //控件重绘 
{
	if(this.b_LoadData==false)
	{
		return;
	} 
	
	this.m_Context.clearRect(0,0,this.m_Canvas.width,this.m_Canvas.height);

	this.m_RectFigure.left=0;
	this.m_RectFigure.right=this.m_Image.width;
	this.m_RectFigure.top=0;
	this.m_RectFigure.bottom=this.m_Image.height; 

  this.m_Context.drawImage(this.m_Image,0,0,this.m_Image.width,this.m_Image.height,
	this.OriginalPoint_Bitmap.x,this.OriginalPoint_Bitmap.y,
	this.m_Image.width*this.m_fZoomNum,
	this.m_Image.height*this.m_fZoomNum);

	
	if(this.b_BShowBackGround)
	{
		var compositeOperation = this.m_Context.globalCompositeOperation;
		this.m_Context.globalCompositeOperation = "destination-over";
		this.m_Context.fillStyle=this.m_InitBackGroundColor;
		this.m_Context.fillRect(0,0, this.m_ClientRect.Width(), this.m_ClientRect.Height()); 

		this.m_Context.globalCompositeOperation = compositeOperation;
	}

//图像大小框
	this.DrawOutSideLine();

//此处显示图像上层的各种图形形   
	if (this.m_FiguresSet.m_nFigureCount>0)
	{ 
		var FindIterator=new Figure ; 
		for(var index=0;index<this.m_FiguresSet.m_nFigureCount;index++)
		{  
			this.DrawFigure(this.m_FiguresSet.m_Figures[index]); 
		} 
	}  
	
//画实时正在画的线条 
	this.drawTempLines();  


//显示其他图形信息
	this.ShowOtherFigures();	
	
}

// FigureData
function ConnectLine(data) //有线组成的图形形连线
{
	var MovePoint=new CPoint(0,0);
	var In_OriginalPoint_cursor=new CPoint(0,0); 
	PointEqual(MovePoint,this.OriginalPoint_Bitmap);  
	var nCurrentPointIndex=0,nPointIndex=0;
//移动到起始点
	var FindIterator=new CPoint(0,0);
	if (data.figure_data.nCPointCount==0)
	{
		return;
	}	
	FindIterator=data.figure_data.m_CPoint[0];
	nCurrentPointIndex++;
	
	//显示第一个小方框
	if ((data.figure_id==this.m_nCursorInFigureId || data.figure_id== this.SelectFigureId) && this.b_ShowPointRect)
	{
		var point=new CPoint(0,0);
		point.x=GetIntValue(FindIterator.x*this.m_fZoomNum)+MovePoint.x+data.shift_x;
		point.y=GetIntValue(FindIterator.y*this.m_fZoomNum)+MovePoint.y+data.shift_y;
		this.DrawPointRect(point,0);				
	} 
	this.m_Context.strokeStyle =data.figure_color;
	this.m_Context.lineWidth=2;
	this.m_Context.beginPath();
	this.m_Context.moveTo(GetIntValue(FindIterator.x*this.m_fZoomNum)+MovePoint.x+data.shift_x,GetIntValue(FindIterator.y*this.m_fZoomNum)+MovePoint.y+data.shift_y);  
	this.m_Context.stroke();
	
	if (data.figure_type==RectType)
	{
		data.figure_rect.left=FindIterator.x;
		data.figure_rect.top=FindIterator.y;
	}
//显示图形名
	var rect=new CRect(0,0,0,0);
	this.m_Context.strokeStyle =data.figure_color;
	
	if(data.figure_type==RectType)
	{
		rect.left=maxValue(0,GetIntValue((data.figure_rect.left+data.figure_rect.right)/2*this.m_fZoomNum)+MovePoint.x+data.shift_x-30);
		rect.right=rect.left+FigureControl_TextLength;
		rect.top=GetIntValue((data.figure_rect.top+data.figure_rect.bottom)/2*this.m_fZoomNum)+MovePoint.y+data.shift_y;
		rect.bottom=rect.top+FigureControl_TextLength;
	}
	else
	{
		rect.left=5+GetIntValue(FindIterator.x*this.m_fZoomNum)+MovePoint.x+data.shift_x;
		rect.right=rect.left+FigureControl_TextLength;
		rect.top=GetIntValue(FindIterator.y*this.m_fZoomNum)+MovePoint.y+data.shift_y;
		rect.bottom=rect.top+FigureControl_TextLength;

	}
	
	this.m_Context.strokeStyle=data.figure_color;
	this.m_Context.fillStyle=data.figure_color;
	this.m_Context.font="30px Georgia";
	this.m_Context.fillText(data.figure_name,rect.left,rect.top); 
	
//对所有点连线	 	
	nPointIndex++;
	var TempColorNum=0;
	for (nPointIndex;nPointIndex<data.figure_data.nCPointCount;nPointIndex++)
	{ 
		FindIterator=data.figure_data.m_CPoint[nPointIndex];
		if (nCurrentPointIndex==3)
		{
			data.figure_rect.right=FindIterator.x;		
			data.figure_rect.bottom=FindIterator.y;
		}
		//连线
		this.m_Context.strokeStyle =data.figure_color;
		this.m_Context.lineTo(GetIntValue(FindIterator.x*this.m_fZoomNum)+MovePoint.x+data.shift_x,
		GetIntValue(FindIterator.y*this.m_fZoomNum)+MovePoint.y+data.shift_y);
		this.m_Context.stroke();		
	}
	FindIterator=data.figure_data.m_CPoint[0];	
	this.m_Context.strokeStyle =data.figure_color;
	this.m_Context.lineTo(GetIntValue(FindIterator.x*this.m_fZoomNum)+MovePoint.x+data.shift_x,
	GetIntValue(FindIterator.y*this.m_fZoomNum)+MovePoint.y+data.shift_y);
	this.m_Context.stroke();
	
	
	nPointIndex=1;
	//显示小方框 
	for (nPointIndex;nPointIndex<data.figure_data.nCPointCount;nPointIndex++)
	{ 
		FindIterator=data.figure_data.m_CPoint[nPointIndex];
 		nCurrentPointIndex++;		
		if (nCurrentPointIndex==3)
		{
			data.figure_rect.right=FindIterator.x;		
			data.figure_rect.bottom=FindIterator.y;
		}		
		if ((data.figure_id==this.m_nCursorInFigureId  || data.figure_id== this.SelectFigureId)  && this.b_ShowPointRect)
		{  
			var point=new CPoint(0,0);
			point.x=GetIntValue(FindIterator.x*this.m_fZoomNum)+MovePoint.x+data.shift_x;
			point.y=GetIntValue(FindIterator.y*this.m_fZoomNum)+MovePoint.y+data.shift_y;
			this.DrawPointRect(point,(++TempColorNum)%2);

			if (data.figure_type==RectType && !data.bShowSqure)
			{
				if (nCurrentPointIndex==2)
				{
					point.x=GetIntValue((FindIterator.x-data.figure_rect.Width()/2.0)*this.m_fZoomNum)+MovePoint.x+data.shift_x;
					point.y=GetIntValue(FindIterator.y*this.m_fZoomNum)+MovePoint.y+data.shift_y;
					this.DrawPointRect(point,2);
				}
				if (nCurrentPointIndex==3)
				{
					point.x=GetIntValue(FindIterator.x*this.m_fZoomNum)+MovePoint.x+data.shift_x;
					point.y=GetIntValue((FindIterator.y-data.figure_rect.Height()/2.0)*this.m_fZoomNum)+MovePoint.y+data.shift_y;
					this.DrawPointRect(point,2);
				}			
				
				if (nCurrentPointIndex==4)
				{
					point.x=GetIntValue((FindIterator.x+data.figure_rect.Width()/2.0)*this.m_fZoomNum)+MovePoint.x+data.shift_x;
					point.y=GetIntValue(FindIterator.y*this.m_fZoomNum)+MovePoint.y+data.shift_y;
					this.DrawPointRect(point,2);

					point.x=GetIntValue(FindIterator.x*this.m_fZoomNum)+MovePoint.x+data.shift_x;
					point.y=GetIntValue((FindIterator.y-data.figure_rect.Height()/2.0)*this.m_fZoomNum)+MovePoint.y+data.shift_y;
					this.DrawPointRect(point,2);
				}
				
			}
		} 		
	}
		
	
	if ((data.figure_id==this.m_nCursorInFigureId  || data.figure_id== this.SelectFigureId)
		 && this.b_LeftButtonDown && data.figure_type==RectType && data.bShowSqure)
	{
		var pt=new CPoint(GetIntValue(data.figure_rect.right*this.m_fZoomNum+MovePoint.x+data.shift_x-
		(data.figure_rect.right-data.figure_rect.left)*this.m_fZoomNum/2.0),
			GetIntValue(data.figure_rect.bottom*this.m_fZoomNum+MovePoint.y+data.shift_y-
			(data.figure_rect.bottom-data.figure_rect.top)/2.0*this.m_fZoomNum));
			
		this.DrawPointRect(pt,2);
	}	
	
}



function PointLable(Figure_id,Figure_point,nPointIndex)
{
	this.Figure_id=Figure_id;
	this.Figure_point=Figure_point;
	this.nPointIndex=nPointIndex;
}


function DrawFigure(data)//绘制图形
{
	//填充图形
	this.FillFigureRect(data);
	//图形周边线条
	if (data.figure_type==CircleType)
	{
		this.DrawEllipseRect(data);
	}
	else if (data.figure_type==DrectType)
	{
		this.DrawDoubleRect(data);
	}
	else
	{
		this.ConnectLine(data); 
	}
}



function drawTempLines()  //实时显示正在画的线条
{
	if (this.m_TempLinesPointSet.nCPointCount==0)
	{
		return;
	}  
	var FindIterator=new CPoint(0,0);
	var FindPointIndex=0;
	
	FindIterator=this.m_TempLinesPointSet.m_CPoint[FindPointIndex];
		
	this.m_Context.beginPath();
	this.m_Context.strokeStyle = "#00ff00";
	this.m_Context.arc(FindIterator.x,FindIterator.y,FigureControl_Radius,Math.PI * 2,false);
	this.m_Context.moveTo(FindIterator.x,FindIterator.y); 
	
	
	FindIterator=this.m_TempLinesPointSet.m_CPoint[++FindPointIndex];
	
	this.m_Context.strokeStyle = "#00ffff";	
	for (FindPointIndex;FindPointIndex<this.m_TempLinesPointSet.nCPointCount;FindPointIndex++)
	{
		FindIterator=this.m_TempLinesPointSet.m_CPoint[FindPointIndex];
		
		this.m_Context.lineTo(FindIterator.x,FindIterator.y);  
	}
	this.m_Context.stroke();
}

function DrawOutSideLine() //图像外围框 
{}


function DrawRect(rect)//绘方框区域
{	
	this.m_Context.beginPath();
	this.m_Context.lineWidth=2;
	this.m_Context.moveTo(rect.left,rect.top);
	this.m_Context.lineTo(rect.right,rect.top);
	this.m_Context.lineTo(rect.right,rect.bottom);
	this.m_Context.lineTo(rect.left,rect.bottom);
	this.m_Context.lineTo(rect.left,rect.top);	
	this.m_Context.stroke();
}

function DrawEllipseRect(data)//绘圆
{
	var rect=new CRect(0,0,0,0);
	rect.left=GetIntValue(data.figure_rect.left*this.m_fZoomNum)+this.OriginalPoint_Bitmap.x+data.shift_x;
	rect.right=GetIntValue(data.figure_rect.right*this.m_fZoomNum)+this.OriginalPoint_Bitmap.x+data.shift_x;
	rect.top=GetIntValue(data.figure_rect.top*this.m_fZoomNum)+this.OriginalPoint_Bitmap.y+data.shift_y;
	rect.bottom=GetIntValue(data.figure_rect.bottom*this.m_fZoomNum)+this.OriginalPoint_Bitmap.y+data.shift_y;
	
	
	var x=rect.GetCenter().x;
	var y=rect.GetCenter().y;
	var a=rect.Width()/2.0;
	var b=rect.Height()/2.0;
 	
	var r = (a > b) ? a : b;
	var ratioX = a / r;
	var ratioY = b / r;
   
	this.m_Context.save();
	this.m_Context.scale(ratioX, ratioY);
	this.m_Context.beginPath();
	this.m_Context.lineWidth=2;
	
	this.m_Context.fillStyle = data.figure_color;
	this.m_Context.strokeStyle = data.figure_color;
	this.m_Context.arc(x / ratioX, y / ratioY, r, 0, 2 * Math.PI, false);
	this.m_Context.stroke();
	this.m_Context.restore();
	
	//绘小方框
	if ((data.figure_id==this.m_nCursorInFigureId || data.figure_id== this.SelectFigureId)&& this.b_ShowPointRect)
	{
		var point=new CPoint(0,0);
		point.x=rect.left+GetIntValue((rect.right-rect.left)/2);
		point.y=rect.top;
		this.DrawPointRect(point,0); 
		point.x=rect.right;
		point.y=rect.top+GetIntValue((rect.bottom-rect.top)/2);
		this.DrawPointRect(point,1); 
		point.x=rect.left+GetIntValue((rect.right-rect.left)/2);
		point.y=rect.bottom;
		this.DrawPointRect(point,0); 
		point.x=rect.left;
		point.y=rect.top+GetIntValue((rect.bottom-rect.top)/2);
		this.DrawPointRect(point,1);
	}
	//显示图形名
	///*
	var ShowNameRect=new CRect(0,0,0,0);
	ShowNameRect.left=rect.left+5;
	ShowNameRect.top=rect.top+GetIntValue((rect.bottom-rect.top)/2.0)-5;
	ShowNameRect.right= ShowNameRect.left+FigureControl_TextLength;
	ShowNameRect.bottom=ShowNameRect.top+FigureControl_TextLength;
	
	this.m_Context.fillText(data.figure_name,ShowNameRect,ShowNameRect.left,
	ShowNameRect.top);
}

function DrawDoubleRect(data)//绘双方框
{
	var rect=new CRect(0,0,0,0);
	var rect_outside=new CRect(0,0,0,0);
	rect.left=GetIntValue(data.figure_rect.left*this.m_fZoomNum)+this.OriginalPoint_Bitmap.x+data.shift_x;
	rect.right=GetIntValue(data.figure_rect.right*this.m_fZoomNum)+this.OriginalPoint_Bitmap.x+data.shift_x;
	rect.top=GetIntValue(data.figure_rect.top*this.m_fZoomNum)+this.OriginalPoint_Bitmap.y+data.shift_y;
	rect.bottom=GetIntValue(data.figure_rect.bottom*this.m_fZoomNum)+this.OriginalPoint_Bitmap.y+data.shift_y;

	rect_outside.left=GetIntValue(data.figure_rect_outside.left*this.m_fZoomNum)+this.OriginalPoint_Bitmap.x+data.shift_x;
	rect_outside.right=GetIntValue(data.figure_rect_outside.right*this.m_fZoomNum)+this.OriginalPoint_Bitmap.x+data.shift_x;
	rect_outside.top=GetIntValue(data.figure_rect_outside.top*this.m_fZoomNum)+this.OriginalPoint_Bitmap.y+data.shift_y;
	rect_outside.bottom=GetIntValue(data.figure_rect_outside.bottom*this.m_fZoomNum)+this.OriginalPoint_Bitmap.y+data.shift_y;
	
	this.m_Context.fillStyle =data.figure_color;
	this.m_Context.strokeStyle = data.figure_color;
	this.DrawRect(rect);
	this.DrawRect(rect_outside); 

//显示小方框
	if ((data.figure_id==this.m_nCursorInFigureId  || data.figure_id== this.SelectFigureId)&&  this.b_ShowPointRect)
	{
		var point=new CPoint(0,0);
		point.x=rect.left;
		point.y=rect.top;
		this.DrawPointRect(point,0);
		point.x=rect.right;
		point.y=rect.top;
		this.DrawPointRect(point,1);
		point.x=rect.right;
		point.y=rect.bottom;
		this.DrawPointRect(point,0);
		point.x=rect.left;
		point.y=rect.bottom;
		this.DrawPointRect(point,1);

		point.x=rect_outside.left;
		point.y=rect_outside.top;
		this.DrawPointRect(point,1);
		point.x=rect_outside.right;
		point.y=rect_outside.top;
		this.DrawPointRect(point,0);
		point.x=rect_outside.right;
		point.y=rect_outside.bottom;
		this.DrawPointRect(point,1);
		point.x=rect_outside.left;
		point.y=rect_outside.bottom;
		this.DrawPointRect(point,0);
	}  
//显示图形名	 
	rect.right=rect.left+FigureControl_TextLength; 
	rect.bottom=rect.top+FigureControl_TextLength;
	
	this.m_Context.fillText(data.figure_name,rect.left,rect.top); 
}
 

function DrawPointRect(point,ColorId)  //绘点方框
{
	var rect=new CRect(0,0,0,0);
	rect.left=point.x-FigureControl_PointRectDistance;
	rect.right=point.x+FigureControl_PointRectDistance;
	rect.top=point.y-FigureControl_PointRectDistance;
	rect.bottom=point.y+FigureControl_PointRectDistance; 
	
	if (ColorId==0)
	{
		this.m_Context.fillStyle = "#00ffff";
		this.m_Context.strokeStyle = "#00ffff";
	}
	else if (ColorId==1)
	{
		this.m_Context.fillStyle = "#ff0000";
		this.m_Context.strokeStyle = "#ff0000";
	} 
	else if (ColorId==2)
	{
		this.m_Context.fillStyle = "#ffffff";
		this.m_Context.strokeStyle = "#ffffff";
	}	
	this.DrawRect(rect);
}



function SearchPoint()			//在图形集里面寻找当前鼠标点的近邻 
{
	var In_OriginalPoint_cursor=new CPoint(0,0);  //当前鼠标所在位置
	PointEqual(In_OriginalPoint_cursor,this.m_cpOriginalPoint_cursor);
	var Iterator=new   Figure;
	var nFigureIndex=0;
	for(nFigureIndex;nFigureIndex<this.m_FiguresSet.m_nFigureCount;nFigureIndex++)
	{
		 //确定单签选中点
		 Iterator=this.m_FiguresSet.m_Figures[nFigureIndex];
		if (Iterator.figure_id==this.m_nCursorInFigureId)
		{
			if (Iterator.figure_type==DrectType)
			{
				var rect=new CRect(0,0,0,0);
				var rect_outside=new CRect(0,0,0,0);
				rect.left=GetIntValue(Iterator.figure_rect.left*this.m_fZoomNum)+this.OriginalPoint_Bitmap.x+Iterator.shift_x;
				rect.right=GetIntValue(Iterator.figure_rect.right*this.m_fZoomNum)+this.OriginalPoint_Bitmap.x+Iterator.shift_x;
				rect.top=GetIntValue(Iterator.figure_rect.top*this.m_fZoomNum)+this.OriginalPoint_Bitmap.y+Iterator.shift_y;
				rect.bottom=GetIntValue(Iterator.figure_rect.bottom*this.m_fZoomNum)+this.OriginalPoint_Bitmap.y+Iterator.shift_y; 
				rect_outside.left=GetIntValue(Iterator.figure_rect_outside.left*this.m_fZoomNum)+this.OriginalPoint_Bitmap.x+Iterator.shift_x;
				rect_outside.right=GetIntValue(Iterator.figure_rect_outside.right*this.m_fZoomNum)+this.OriginalPoint_Bitmap.x+Iterator.shift_x;
				rect_outside.top=GetIntValue(Iterator.figure_rect_outside.top*this.m_fZoomNum)+this.OriginalPoint_Bitmap.y+Iterator.shift_y;
				rect_outside.bottom=GetIntValue(Iterator.figure_rect_outside.bottom*this.m_fZoomNum)+this.OriginalPoint_Bitmap.y+Iterator.shift_y; 
				var pt=new Array(9);
				for (var nPt=0;nPt<9;nPt++)
					pt[nPt]=new CPoint(0,0); 
				pt[1].x=rect.left;
				pt[1].y=rect.top;
				pt[2].x=rect.right;
				pt[2].y=rect.top;
				pt[3].x=rect.right;
				pt[3].y=rect.bottom;
				pt[4].x=rect.left;
				pt[4].y=rect.bottom;
				pt[5].x=rect_outside.left;
				pt[5].y=rect_outside.top;
				pt[6].x=rect_outside.right;
				pt[6].y=rect_outside.top;
				pt[7].x=rect_outside.right;
				pt[7].y=rect_outside.bottom;
				pt[8].x=rect_outside.left;
				pt[8].y=rect_outside.bottom; 
				for (var i=1;i<=8;i++)
				{					
					if (this.PointInPointRect(In_OriginalPoint_cursor,pt[i]))
					{
						this.CurrentSelectPoint.Figure_id=Iterator.figure_id;
						this.CurrentSelectPoint.Figure_point.x=GetIntValue((pt[i].x-this.OriginalPoint_Bitmap.x)/this.m_fZoomNum);
						this.CurrentSelectPoint.Figure_point.y=GetIntValue((pt[i].y-this.OriginalPoint_Bitmap.y)/this.m_fZoomNum);
						this.CurrentSelectPoint.nPointIndex=i;
						//已经找到该点，返回 
						this.b_FigurePointSelect=true;
						return; 
					}
					else
					{
						this.b_FigurePointSelect=false;
					}

				} 
			}
			else if (Iterator.figure_type==CircleType)
			{
				var rect=new CRect(0,0,0,0);
				rect.left=GetIntValue(Iterator.figure_rect.left*this.m_fZoomNum)+this.OriginalPoint_Bitmap.x+Iterator.shift_x;
				rect.right=GetIntValue(Iterator.figure_rect.right*this.m_fZoomNum)+this.OriginalPoint_Bitmap.x+Iterator.shift_x;
				rect.top=GetIntValue(Iterator.figure_rect.top*this.m_fZoomNum)+this.OriginalPoint_Bitmap.y+Iterator.shift_y;
				rect.bottom=GetIntValue(Iterator.figure_rect.bottom*this.m_fZoomNum)+this.OriginalPoint_Bitmap.y+Iterator.shift_y; 
				var pt=new Array(5);
				for (var nPt=0;nPt<5;nPt++)
					pt[nPt]=new CPoint(0,0); 
				pt[1].x=rect.left+GetIntValue(((rect.right-rect.left)/2));
				pt[1].y=rect.top; 
				pt[2].x=rect.right;
				pt[2].y=rect.top+GetIntValue(((rect.bottom-rect.top)/2)); 
				pt[3].x=rect.left+GetIntValue(((rect.right-rect.left)/2));
				pt[3].y=rect.bottom; 
				pt[4].x=rect.left;
				pt[4].y=rect.top+GetIntValue(((rect.bottom-rect.top)/2)); 
				for (var i=1;i<=4;i++)
				{
					if (PointInPointRect(In_OriginalPoint_cursor,pt[i]))
					{
						this.CurrentSelectPoint.Figure_id=Iterator.figure_id;
						this.CurrentSelectPoint.Figure_point.x=GetIntValue((pt[i].x-this.OriginalPoint_Bitmap.x)/this.m_fZoomNum);
						this.CurrentSelectPoint.Figure_point.y=GetIntValue((pt[i].y-this.OriginalPoint_Bitmap.y)/this.m_fZoomNum); 
						//已经找到该点，返回 
						this.b_FigurePointSelect=true;
						this.CurrentSelectPoint.nPointIndex=i;
						return;

					}
					else
					{
						this.b_FigurePointSelect=false;
					}
				}
			}
			else if (Iterator.figure_type==PolyType || Iterator.figure_type==RectType)
			{				
				var FindIterator=new CPoint(0,0);
				var nPointIndex=0;
				var centerPoint=new CPoint(0,0);
				var nFindPointIndex=0;
				for (nFindPointIndex;nFindPointIndex<Iterator.figure_data.nCPointCount;nFindPointIndex++)
				{
					FindIterator=Iterator.figure_data.m_CPoint[nFindPointIndex];
					nPointIndex++;
					var pt=new CPoint(0,0); 
					
					pt.x=GetIntValue(FindIterator.x*this.m_fZoomNum)+this.OriginalPoint_Bitmap.x+Iterator.shift_x;
					pt.y=GetIntValue(FindIterator.y*this.m_fZoomNum)+this.OriginalPoint_Bitmap.y+Iterator.shift_y;

					centerPoint.x=pt.x;
					centerPoint.y=pt.y;
					if (nPointIndex<=4 && Iterator.figure_type==RectType)
					{
						switch(nPointIndex)
						{
						case 1:
							centerPoint.x=GetIntValue((FindIterator.x+Iterator.figure_rect.Width()/2.0)*this.m_fZoomNum)+this.OriginalPoint_Bitmap.x+Iterator.shift_x;
							break;
						case 2:
							centerPoint.y=GetIntValue((FindIterator.y+Iterator.figure_rect.Height()/2.0)*this.m_fZoomNum)+this.OriginalPoint_Bitmap.y+Iterator.shift_y;
							break;
						case 3:
							centerPoint.x=GetIntValue((FindIterator.x-Iterator.figure_rect.Width()/2.0)*this.m_fZoomNum)+this.OriginalPoint_Bitmap.x+Iterator.shift_x;
							break;
						case 4:
							centerPoint.y=GetIntValue((FindIterator.y-Iterator.figure_rect.Height()/2.0)*this.m_fZoomNum)+this.OriginalPoint_Bitmap.y+Iterator.shift_y;
							break;
						default:
							break;
						}
						if (this.PointInPointRect(In_OriginalPoint_cursor,centerPoint))
						{ 
							this.CurrentSelectPoint.Figure_id=Iterator.figure_id;
							this.CurrentSelectPoint.Figure_point.x=centerPoint.x;
							this.CurrentSelectPoint.Figure_point.y=centerPoint.y;
							this.CurrentSelectPoint.nPointIndex=nPointIndex+4;
							this.b_FigurePointSelect=true;
							//已经找到该点，返回
							return; 
						}
					}

					if (this.PointInPointRect(In_OriginalPoint_cursor,pt))
					{ 
						this.CurrentSelectPoint.Figure_id=Iterator.figure_id;
						this.CurrentSelectPoint.Figure_point.x=FindIterator.x;
						this.CurrentSelectPoint.Figure_point.y=FindIterator.y;
						this.b_FigurePointSelect=true;
						this.CurrentSelectPoint.nPointIndex=nPointIndex;
						//已经找到该点，返回
						return; 
					} 
					else
					{
						this.b_FigurePointSelect=false;
					}
				}
			}
		}
		else
		{
			this.b_FigurePointSelect=false;
		}
	}
}



function PointGoOutSide(point)  //当前点是否已经超出图片移动范围
{
	if(point.x<this.OriginalPoint_Bitmap.x || point.y<this.OriginalPoint_Bitmap.y)
	{ 
		return true;
	}
	if ( point.x>this.OriginalPoint_Bitmap.x+this.m_RectFigure.Width()*this.m_fZoomNum 
	|| point.y>this.OriginalPoint_Bitmap.y+this.m_RectFigure.Height()*this.m_fZoomNum)
	{	 
		return true;
	}  
	return false;
}

function ShowOtherFigures()  //显示剩余的一些图形形
{	
	var rect=new CRect;
	if (this.PointGoOutSide(this.m_MovePoint_cursor)==false && this.PointGoOutSide(this.m_cpLastClickPoint)==false)
	{  
		//显示实时多边形
		if (this.b_LButtonDouC)
		{ 
			this.m_Context.fillStyle = "#00ff00";
			this.m_Context.strokeStyle ="#00ff00";
			this.m_Context.moveTo(this.m_cpLastClickPoint.x,this.m_cpLastClickPoint.y);
			this.m_Context.lineTo(this.m_MovePoint_cursor.x,this.m_MovePoint_cursor.y);  

			var point=new CPoint;
			point.x=GetIntValue(this.CurrentFigure.figure_data.m_CPoint[0].x*this.m_fZoomNum)+this.OriginalPoint_Bitmap.x+this.CurrentFigure.shift_x;
			point.y=GetIntValue(this.CurrentFigure.figure_data.m_CPoint[0].y*this.m_fZoomNum)+this.OriginalPoint_Bitmap.y+this.CurrentFigure.shift_y;

			this.m_Context.moveTo(point.x,point.y);
			this.m_Context.lineTo(this.m_MovePoint_cursor.x,this.m_MovePoint_cursor.y);  

			this.m_Context.stroke();
		}  
		rect.top=this.m_cpLastClickPoint.y;
		rect.left=this.m_cpLastClickPoint.x;
		rect.right=this.m_MovePoint_cursor.x;
		rect.bottom=this.m_MovePoint_cursor.y;

		//显示实时方框
		if (this.b_PreDrawRect )
		{  
			this.m_Context.fillStyle = "#00ff00";
			this.m_Context.strokeStyle ="#00ff00";
			this.DrawRect(rect);
		}
		//显示双方框
		if(this.b_PreDrawDoubleRect )
		{
			this.DrawRect(rect);
			var rect_outside=new CRect;
			rect_outside.left=rect.left-FigureControl_DoubleRectDistance;
			rect_outside.right=rect.right+FigureControl_DoubleRectDistance;
			rect_outside.top=rect.top-FigureControl_DoubleRectDistance;
			rect_outside.bottom=rect.bottom+FigureControl_DoubleRectDistance;

			this.m_Context.fillStyle = "#00ff00";
			this.m_Context.strokeStyle ="#00ff00";
			this.DrawRect(rect_outside);
		}  
		//显示实时圆
		if(this.b_PreDrawCircle)
		{
			
				var x=rect.GetCenter().x;
				var y=rect.GetCenter().y;
				var a=rect.Width()/2.0;
				var b=rect.Height()/2.0;
				
				var r = (a > b) ? a : b;
				var ratioX = a / r;
				var ratioY = b / r;
				
				this.m_Context.save();
				this.m_Context.scale(ratioX, ratioY);
				this.m_Context.beginPath();
				this.m_Context.fillStyle = "#00ff00";
				this.m_Context.strokeStyle ="#00ff00";
				this.m_Context.arc(x / ratioX, y / ratioY, maxValue(0,r), 0, 2 * Math.PI, false);
				this.m_Context.stroke();
				this.m_Context.restore();
		}
	}

//显示标记点 
	if (this.b_ShowPositionLabel)  //防止绘点越界 
	{
		var CrossLeftPoint=new CPoint;
		var CrossRightPoint=new CPoint;
		var CrossTopPoint=new CPoint;
		var CrossBottomPoint=new CPoint;
	
		this.m_Context.lineWidth=3;
		//this.m_Context.setLineDash([8,8]);
		this.m_Context.strokeStyle ="#00ff00";
		CrossLeftPoint.x=this.m_PositionLabel.x-FigureControl_CrossSize;
		CrossLeftPoint.y=this.m_PositionLabel.y;
		CrossRightPoint.x=this.m_PositionLabel.x+FigureControl_CrossSize;
		CrossRightPoint.y=this.m_PositionLabel.y;
		CrossTopPoint.x=this.m_PositionLabel.x;
		CrossTopPoint.y=this.m_PositionLabel.y-FigureControl_CrossSize;
		CrossBottomPoint.x=this.m_PositionLabel.x;
		CrossBottomPoint.y=this.m_PositionLabel.y+FigureControl_CrossSize;
		this.m_Context.moveTo(CrossTopPoint.x,CrossTopPoint.y);
		this.m_Context.lineTo(CrossBottomPoint.x,CrossBottomPoint.y);
	  this.m_Context.moveTo(CrossLeftPoint.x,CrossLeftPoint.y);
	  this.m_Context.lineTo(CrossRightPoint.x,CrossLeftPoint.y);
		this.m_Context.stroke();
	} 
}



function ShiftImageToCenter()  //初始图像居中 
{
	var temp_x=0,temp_y=0;   
	temp_x=GetIntValue((this.m_ClientRect.Width()-this.m_Image.width*this.m_fZoomNum)/2);
	temp_y=GetIntValue((this.m_ClientRect.Height()-this.m_Image.height*this.m_fZoomNum)/2);
	this.OriginalPoint_Bitmap.x=temp_x;
	this.OriginalPoint_Bitmap.y=temp_y; 
	this.m_nControlWidth=temp_x;
	this.m_nControlHeight=temp_y;
	this.RepaintControl();
}



/************************************************************************/
/* 
该组函数用来在控件中手动绘制图形
csFigureName	图形名字
strReservedData 保留字段
*/
/************************************************************************/
function DrawRectFigure(csFigureName,figurecolor)//绘制方框
{
	this.ClearDrawStatus();
	this.m_FigureColor=figurecolor;
	this.m_csCurrentDrawFigureName=csFigureName;
	this.b_DrawRect=true;	
	this.RepaintControl();
	return this.b_DrawRect;
}

function DrawDoubleRectFigure(csFigureName,figurecolor)		//绘制双方框
{
	this.ClearDrawStatus();
	this.m_FigureColor=figurecolor;
	this.m_csCurrentDrawFigureName=csFigureName;
	this.b_DrawDoubleRect=true;
	this.RepaintControl();
	return this.b_DrawDoubleRect;
}
function DrawPolyFigure(csFigureName,figurecolor)				//绘制多边形
{
	this.ClearDrawStatus();
	this.SetPolyPointCount(FigureControl_MaxPointCount);
	this.m_FigureColor=figurecolor;
	this.m_csCurrentDrawFigureName=csFigureName;
	this.b_DrawPoly=true;
	this.RepaintControl();
	return this.b_DrawPoly;
}
function DrawCircleFigure(csFigureName,figurecolor)			//绘制圆形 
{
	this.ClearDrawStatus();
	this.m_FigureColor=figurecolor;
	this.m_csCurrentDrawFigureName=csFigureName;
	this.b_DrawCircle=true; 	
	this.RepaintControl();
	return this.b_DrawCircle;
}				


//获取鼠标所在位置
//void GetCursorPosition(CPoint);								

/************************************************************************/
/* 
PointData	点数据
nPointNum	点个数
figureColor 图形颜色
CString 图形名字
strReservedDat 保留数据
返回值:		新建图形ID
*/
/************************************************************************/
//外部传入多边形方框
//int   CPoint *PointData,int nPointNum,COLORREF,CString,void* strReservedData=NULL
function O_DrawPolyFigure(PointData,nPointNum,figureColor,strName)
{
	
	var FigureItem=new Figure;
	FigureItem.figure_type=PolyType;
	FigureItem.figure_id=++this.m_nFigureCount;	
	FigureItem.figure_color=figureColor;
	FigureItem.figure_name=strName;

	for(var nIndex=0;nIndex<nPointNum;nIndex++)
	{
		FigureItem.figure_data.AddCPoint(PointData[nIndex]);
	}

	this.m_FiguresSet.AddFigure(FigureItem);
	this.AddFigureHis(this.m_FiguresSet);
	this.RepaintControl();
}

function O_DrawRectFigure(OutSideRect,figureColor,strName)
{
	var FigureItem=new Figure;
	FigureItem.figure_type=RectType;
	FigureItem.figure_id=++this.m_nFigureCount;
	FigureItem.rect=OutSideRect;
	FigureItem.figure_color=figureColor;
	FigureItem.figure_name=strName;
	
	var pt=new CPoint;
	pt.x=OutSideRect.left;
	pt.y=OutSideRect.top;
	FigureItem.figure_data.AddCPoint(pt);
	pt.x=OutSideRect.right;
	pt.y=OutSideRect.top;
	FigureItem.figure_data.AddCPoint(pt);
	pt.x=OutSideRect.right;
	pt.y=OutSideRect.bottom;
	FigureItem.figure_data.AddCPoint(pt);
	pt.x=OutSideRect.left;
	pt.y=OutSideRect.bottom;
	FigureItem.figure_data.AddCPoint(pt);

	this.m_FiguresSet.AddFigure(FigureItem);
	this.AddFigureHis(this.m_FiguresSet);
	this.RepaintControl();
	
}
//外部传入圆 
//rect 内部画圆
function O_DrawCircleFigure(rect,figureColor,strName)	
{
	var FigureItem=new Figure;
	FigureItem.figure_type=CircleType;
	FigureItem.figure_id=++this.m_nFigureCount;
	FigureItem.rect=rect;
	FigureItem.figure_color=figureColor;
	FigureItem.figure_name=strName;

	this.m_FiguresSet.AddFigure(FigureItem);
	this.AddFigureHis(this.m_FiguresSet);
	this.RepaintControl();
}

//外部传双方框  
//int 
function O_DrawDoubleRectFigure(InsideRect,OutsideRect,figureColor,strName)	
{
	var FigureItem=new Figure;
	FigureItem.figure_type=CircleType;
	FigureItem.figure_id=++this.m_nFigureCount;
	FigureItem.rect=InsideRect;
	FigureItem.rect_outside=OutsideRect;
	FigureItem.figure_color=figureColor;
	FigureItem.figure_name=strName;
	this.m_FiguresSet.AddFigure(FigureItem);
	this.RepaintControl();
}


/************************************************************************/

//BOOL list<Figure>::iterator pFigure, int nShiftX, int nShiftY
function CheckFigureGotoOutSide(pFigure, nShiftX,nShiftY)
{}

//CRect * pRect , list<Figure>::iterator Iterator
function GetFigureOutsideRect(pRect,Iterator)
{}


function FinishDrawPolyFigure()
{
	if(this.b_LButtonDouC==true && this.b_DrawPoly)   //又一次双击，结束画上次图形
	{		
		this.b_LButtonDouC=false; 
/*
		if(this.m_PolyPointCount==FigureControl_MaxPointCount)
		{
			var BeginPoint=new CPoint(0,0);
			var EndPoint=new CPoint(0,0);
			var MidPoint=new CPoint(0,0);
	
			var NewFgureData=new figure_data;		
			for (var pointIndex=0;pointIndex<this.CurrentFigure.figure_data.nCPointCount;pointIndex++)
			{
				BeginPoint=this.CurrentFigure.figure_data.m_CPoint[pointIndex];			
				var NextPoint=pointIndex+1;
				if(pointIndex==maxValue(0,this.CurrentFigure.figure_data.nCPointCount-1))
					NextPoint=0;
				EndPoint=this.CurrentFigure.figure_data.m_CPoint[NextPoint];
			
				MidPoint.x=GetIntValue(((BeginPoint.x+EndPoint.x)/2.0));
				MidPoint.y=GetIntValue(((BeginPoint.y+EndPoint.y)/2.0));
	
				NewFgureData.InsertPointData(BeginPoint);		
				NewFgureData.InsertPointData(MidPoint);			
			}	
			this.CurrentFigure.figure_data=cloneObj(NewFgureData);
		}		
*/
		this.CurrentFigure.figure_id=++this.m_nFigureCount;
		this.CurrentFigure.figure_color=this.m_FigureColor;
		this.CurrentFigure.figure_type=PolyType;  	
		this.CurrentFigure.figure_name=this.m_csCurrentDrawFigureName;
		this.CurrentFigure.figure_data.MaxPointCount=this.m_PolyPointCount;
		this.CurrentFigure.ReserverData=this.m_strDataReserved;

		this.m_csCurrentDrawFigureName="";
		this.m_FiguresSet.AddFigure(this.CurrentFigure);
		this.AddFigureHis(this.m_FiguresSet);


		this.CurrentFigure.ClearFigureData(); 
		this.m_TempLinesPointSet.ClearData();

		this.RepaintControl();			
	} 
}