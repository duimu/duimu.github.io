function SetFillStyle(nIndex) //设置填充风格
{

}

function GetFillStyle(nIndex)		//获取填充风格；
{}

function setInitZoomScale(num)				// 初始缩放比率，放大的，为负数
{
	num=-num;
	this.m_nScrollRate=GetIntValue(num*10);
	if (num>0)
	{   //最大放大倍率
		if (num<-60)
		{
			return false;
		} 
		this.m_fZoomNum= Math.pow(FigureControl_ScaleBot,this.m_nScrollRate);  
		this.m_ImageHeight=this.m_ClientRect.height*this.m_fZoomNum;
		this.m_ImageWeith=this.m_ClientRect.width*this.m_fZoomNum;
		this.m_OldImageWeith=this.m_ClientRect.width*Math.pow(FigureControl_ScaleBot,this.m_nScrollRate+1);
		this.m_OldImageHeight=this.m_ClientRect.height*Math.pow(FigureControl_ScaleBot,this.m_nScrollRate+1);
		this.m_CurrentDistance.x=GetIntValue((this.m_ImageWeith-this.m_OldImageWeith)/2);
		this.m_CurrentDistance.y=GetIntValue((this.m_ImageHeight-this.m_OldImageHeight)/2);
		this.OriginalPoint_Bitmap.x=(this.OriginalPoint_Bitmap.x-this.m_CurrentDistance.x); 
		this.OriginalPoint_Bitmap.y=(this.OriginalPoint_Bitmap.y-this.m_CurrentDistance.y);

	} 
	else 
	{	  
		if (num>60)
		{
			return false;
		} 
		this.m_fZoomNum=Math.pow(FigureControl_ScaleBot,this.m_nScrollRate); 
		this.m_ImageHeight=this.m_ClientRect.height*this.m_fZoomNum;
		this.m_ImageWeith=this.m_ClientRect.width*this.m_fZoomNum; 
		this.m_OldImageWeith=this.m_ClientRect.width*Math.pow(FigureControl_ScaleBot,this.m_nScrollRate-1);
		this.m_OldImageHeight=this.m_ClientRect.height*Math.pow(FigureControl_ScaleBot,this.m_nScrollRate-1);
		this.m_CurrentDistance.x=-GetIntValue((this.m_OldImageWeith-this.m_ImageWeith)/2);
		this.m_CurrentDistance.y=-GetIntValue((this.m_OldImageHeight-this.m_ImageHeight)/2);
		this.OriginalPoint_Bitmap.x=(this.OriginalPoint_Bitmap.x-this.m_CurrentDistance.x);
		this.OriginalPoint_Bitmap.y=(this.OriginalPoint_Bitmap.y-this.m_CurrentDistance.y);
	}     
	this.RepaintControl(); 
	return true;
}

function SelectSubFigureRectSet(pt) //确定当前点所在的区域范围集合 BOOL
{
	//此处显示图像上层的各种选择框   
	if (this.m_FiguresSet.m_nFigureCount==0)
	{
		this.b_SubFiguresMove=false;
		return false;
	}
	var nWidth = 1000000, nHeight = 100000;
	var nFindIndex = 1;
	var MovePoint=new CPoint(0,0);
	var In_OriginalPoint_cursor=new CPoint(0,0);  
	PointEqual(MovePoint,this.OriginalPoint_Bitmap); 
	PointEqual(In_OriginalPoint_cursor,this.m_cpOriginalPoint_cursor);
	var LinePointBegin=new CPoint(0,0);
	var LinePointEnd=new CPoint(0,0);
	var Iterator=new Figure;
	var FigureIndex=0;	
	for(FigureIndex;FigureIndex<this.m_FiguresSet.m_nFigureCount;FigureIndex++)
	{   
		Iterator=this.m_FiguresSet.m_Figures[FigureIndex];
		var PointInRect=0;  
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
 
			if (In_OriginalPoint_cursor.x>=rect_outside.left  
				&&In_OriginalPoint_cursor.x<=rect_outside.right 
				&& In_OriginalPoint_cursor.y>=rect_outside.top 
				&& In_OriginalPoint_cursor.y<=rect_outside.bottom)
			{
				this.m_SelectSubFigureRectIdSet.AddFiguretRect(Iterator.figure_id);

				if (rect_outside.Width()<nWidth
				|| rect_outside.Height()<nHeight)
				{
					nFindIndex = Iterator.figure_id;
					nWidth = rect_outside.Width();
					nHeight = rect_outside.Height();
				}
			}	

		

			var CornerPoint=new Array(8);
			for(var index=0;index<8;index++)
				CornerPoint[index]=new CPoint(0,0);
			CornerPoint[0].x=rect.left;
			CornerPoint[0].y=rect.top;
			CornerPoint[1].x=rect.right;
			CornerPoint[1].y=rect.top;
			CornerPoint[2].x=rect.right;
			CornerPoint[2].y=rect.bottom;
			CornerPoint[3].x=rect.left;
			CornerPoint[3].y=rect.bottom;
			CornerPoint[4].x=rect_outside.left;
			CornerPoint[4].y=rect_outside.top;
			CornerPoint[5].x=rect_outside.right;
			CornerPoint[5].y=rect_outside.top;
			CornerPoint[6].x=rect_outside.right;
			CornerPoint[6].y=rect_outside.bottom;
			CornerPoint[7].x=rect_outside.left;
			CornerPoint[7].y=rect_outside.bottom;
			for (var i=0;i<8;i++)
			{
				if (PointInPointRect(In_OriginalPoint_cursor,CornerPoint[i]))
				{
					this.m_SelectSubFigureRectIdSet.AddFiguretRect(Iterator.figure_id);
					return nFindIndex;
					//break;
				}
			}
		}
		else if (Iterator.figure_type==CircleType)
		{
			var rect=new CRect;
			rect.left=GetIntValue(Iterator.figure_rect.left*this.m_fZoomNum)+this.OriginalPoint_Bitmap.x+Iterator.shift_x;
			rect.right=GetIntValue(Iterator.figure_rect.right*this.m_fZoomNum)+this.OriginalPoint_Bitmap.x+Iterator.shift_x;
			rect.top=GetIntValue(Iterator.figure_rect.top*this.m_fZoomNum)+this.OriginalPoint_Bitmap.y+Iterator.shift_y;
			rect.bottom=GetIntValue(Iterator.figure_rect.bottom*this.m_fZoomNum)+this.OriginalPoint_Bitmap.y+Iterator.shift_y;

			if (InEllipseRect(rect,In_OriginalPoint_cursor))
			{
				this.m_SelectSubFigureRectIdSet.AddFiguretRect(Iterator.figure_id);
				if (rect.Width() < nWidth || rect.Height() < nHeight)
				{
					nFindIndex = Iterator.figure_id;
					nWidth = rect.Width();
					nHeight = rect.Height();
				}
			}			

			var CornerPoint=new Array(4);
			for(var index=0;index<4;index++)
				CornerPoint[index]=new CPoint(0,0);
				
			CornerPoint[0].x=rect.left+rect.Width()/2;
			CornerPoint[0].y=rect.top;
			CornerPoint[1].x=rect.right;
			CornerPoint[1].y=rect.top+rect.Height()/2;
			CornerPoint[2].x=rect.left+rect.Width()/2;
			CornerPoint[2].y=rect.bottom;
			CornerPoint[3].x=rect.left;
			CornerPoint[3].y=rect.top+rect.Height()/2;
			for (var i=0;i<4;i++)
			{
				if (PointInPointRect(In_OriginalPoint_cursor,CornerPoint[i]))
				{
					this.m_SelectSubFigureRectIdSet.AddFiguretRect(Iterator.figure_id);
					return nFindIndex;
					//break;
				}
			}
		}
		else
		{
			var nLeft = 100000, nTop = 100000;
			var nBottom = 0, nRight = 0;
			
			for(var nIndex=0;nIndex<Iterator.figure_data.nCPointCount;nIndex++)
			{
				var pt=Iterator.figure_data.m_CPoint[nIndex];
				var nX = GetIntValue(pt.x*this.m_fZoomNum) + MovePoint.x + Iterator.shift_x;
				var nY = GetIntValue(pt.y*this.m_fZoomNum) + MovePoint.y + Iterator.shift_y; 
				if (nX<nLeft)
				{
					nLeft = nX;
				}
				if (nX>nRight)
				{
					nRight = nX;
				}
				if (nY < nTop)
				{
					nTop = nY;
				}
				if (nY > nBottom)
				{
					nBottom = nY;
				}
			}



			if (Iterator.figure_data.nCPointCount>0)  //只计算由点连接组成的图形
			{ 
				var FindIndex=0;				
				var FindIterator=new CPoint;
				FindIterator.x=Iterator.figure_data.m_CPoint[FindIndex].x; 
				FindIterator.y=Iterator.figure_data.m_CPoint[FindIndex].y; 
				LinePointBegin.x=GetIntValue(FindIterator.x*this.m_fZoomNum)+MovePoint.x+Iterator.shift_x;
				LinePointBegin.y=GetIntValue(FindIterator.y*this.m_fZoomNum)+MovePoint.y+Iterator. shift_y;
				var nCurrentPointIndex=0;
				var CenterPoint=new CPoint(0,0);
				for (FindIndex;FindIndex<Iterator.figure_data.nCPointCount;FindIndex++)
				{
					nCurrentPointIndex++;
					FindIterator.x=Iterator.figure_data.m_CPoint[FindIndex].x; 
					FindIterator.y=Iterator.figure_data.m_CPoint[FindIndex].y; 
					//计算是否与投影相连
					LinePointEnd.x=GetIntValue(FindIterator.x*this.m_fZoomNum)+MovePoint.x+Iterator.shift_x;
					LinePointEnd.y=GetIntValue(FindIterator.y*this.m_fZoomNum)+MovePoint.y+Iterator.shift_y;  
					if (this.InSubFigureRect(In_OriginalPoint_cursor,LinePointBegin,LinePointEnd))
					{
						PointInRect++;
					} 
					LinePointBegin.x=LinePointEnd.x;
					LinePointBegin.y=LinePointEnd.y;

					var CornerPoint=new CPoint(0,0);
					CornerPoint.x=LinePointEnd.x;
					CornerPoint.y=LinePointEnd.y;
					
					if(Iterator.figure_type==RectType)
					{
						switch(nCurrentPointIndex)
						{
						case 1:
							CenterPoint.x=GetIntValue((FindIterator.x+Iterator.figure_rect.Width()/2.0)*this.m_fZoomNum)+
								MovePoint.x+Iterator.shift_x;
							CenterPoint.y=LinePointEnd.y;
							break;
						case 2:
							CenterPoint.x=LinePointEnd.x;
							CenterPoint.y=GetIntValue((FindIterator.y+Iterator.figure_rect.Height()/2.0)*this.m_fZoomNum)+MovePoint.y
								+Iterator.shift_y;  
							break;
						case 3:
							CenterPoint.x=GetIntValue((FindIterator.x-Iterator.figure_rect.Width()/2.0)*this.m_fZoomNum)+
								MovePoint.x+Iterator.shift_x; 
							CenterPoint.y=LinePointEnd.y;
							break;
						case 4:
							CenterPoint.x=LinePointEnd.x;
							CenterPoint.y=GetIntValue((FindIterator.y-Iterator.figure_rect.Height()/2.0)*this.m_fZoomNum)+MovePoint.y
								+Iterator.shift_y;  
						default:
							break;
						}							
					}
					//console.log(In_OriginalPoint_cursor.x,In_OriginalPoint_cursor.y,CornerPoint[i].x,CornerPoint[i].y);
					if (PointInPointRect(In_OriginalPoint_cursor,CornerPoint) 
					|| PointInPointRect(In_OriginalPoint_cursor,CenterPoint))
					{		
						if ((nRight - nLeft) < nWidth
							|| (nBottom - nTop) < nHeight)
						{
							nFindIndex = Iterator.figure_id;

							nWidth = nRight - nLeft;
							nHeight = nBottom - nTop;
						}
						this.m_SelectSubFigureRectIdSet.AddFiguretRect(Iterator.figure_id);
						return nFindIndex;
						//break;
					}
					
				}
				//最后一条边
				FindIterator.x=Iterator.figure_data.m_CPoint[0].x;
				FindIterator.y=Iterator.figure_data.m_CPoint[0].y;
				LinePointEnd.x=GetIntValue(FindIterator.x*this.m_fZoomNum)+MovePoint.x+Iterator.shift_x;
				LinePointEnd.y=GetIntValue(FindIterator.y*this.m_fZoomNum)+MovePoint.y+Iterator.shift_y; 
				
				if (this.InSubFigureRect(In_OriginalPoint_cursor,LinePointBegin,LinePointEnd))
				{
					PointInRect++;
				}  
				//存入当前鼠标点所在区域的集合队列
				if (PointInRect%2==1)
				{ 
					if ((nRight - nLeft) < nWidth
						|| (nBottom - nTop) < nHeight)
					{
						nFindIndex = Iterator.figure_id;

						nWidth = nRight - nLeft;
						nHeight = nBottom - nTop;
					}

					this.m_SelectSubFigureRectIdSet.AddFiguretRect(Iterator.figure_id);
					//break;
				}	

				var CornerPoint=new CPoint(0,0);
				CornerPoint.x=LinePointEnd.x;
				CornerPoint.y=LinePointEnd.y;				

				if (this.PointInPointRect(In_OriginalPoint_cursor,CornerPoint))
				{
					if ((nRight - nLeft) < nWidth
						|| (nBottom - nTop) < nHeight)
					{
						nFindIndex = Iterator.figure_id;

						nWidth = nRight - nLeft;
						nHeight = nBottom - nTop;
					}
					this.m_SelectSubFigureRectIdSet.AddFiguretRect(Iterator.figure_id);
					return nFindIndex; 
					//break;
				}
				PointInRect=0;
			}
		} 
	}


	if(this.m_SelectSubFigureRectIdSet.m_nFigureRectCount==0
		|| this.b_ShowPointRect==false)
	{
		this.b_SubFiguresMove=false;
	}
	else 
		this.b_SubFiguresMove=true;

	return nFindIndex;
}


//复制指定图形
function CopyCurrentSelectFigureRect(nId)			
{}
//删除指定类型的图形
function DeleteFigureType(nFigureType)		
{
	
	this.AddFigureHis(this.m_FiguresSet);		
	this.AddFigureHis(this.m_FiguresSet);		
    var NewfigureSet=new FiguresSet;
    if (this.m_FiguresSet.m_nFigureCount>0)
    { 
        for(var index=0;index<this.m_FiguresSet.m_nFigureCount;index++)
        {  				
            if(this.m_FiguresSet.m_Figures[index].figure_type!=nFigureType)
            {
                NewfigureSet.m_Figures[NewfigureSet.m_nFigureCount++]=this.m_FiguresSet.m_Figures[index];
            }
        } 
    }    
        
    this.m_FiguresSet=NewfigureSet;
    this.RepaintControl();
}
//删除最后一个图形
function DeleteLastFigure()			
{

}

//删除指定图形
function DeleteSelectFigure(nid)						
{	
	this.AddFigureHis(this.m_FiguresSet);		
	var NewfigureSet=new FiguresSet;
    if (this.m_FiguresSet.m_nFigureCount>0)
    { 
        for(var index=0;index<this.m_FiguresSet.m_nFigureCount;index++)
        {  				
            if(this.m_FiguresSet.m_Figures[index].figure_id!=nid)
            {
                NewfigureSet.m_Figures[NewfigureSet.m_nFigureCount++]=this.m_FiguresSet.m_Figures[index];
            }
        } 
    }    
        
    this.m_FiguresSet=NewfigureSet;
    this.RepaintControl();
}
//删除指定的图形区域
function DeleteFigureByName(name)	
{
	var NewfigureSet=new FiguresSet;
    if (this.m_FiguresSet.m_nFigureCount>0)
    { 
        for(var index=0;index<this.m_FiguresSet.m_nFigureCount;index++)
        {  				
            if(this.m_FiguresSet.m_Figures[index].figure_name!=name)
            {
                NewfigureSet.m_Figures[NewfigureSet.m_nFigureCount++]=this.m_FiguresSet.m_Figures[index];
            }
        } 
    }    
        
    this.m_FiguresSet=NewfigureSet;
    this.RepaintControl();
}
//是否选中边缘点
function BSelectFigurePoint()		
{}
//双方框对角位置是否同时拖动
function SetDRectChooseType(bAllShift)
{

}

//图形形是否能够移动
function SetFigureMoveStatus(bStatus)		
{
	this.b_SubFiguresMove=bStatus;
}
//显示边小方框
function ShowPointRect(bShow)			
{
    this.ChangeFigureSize(bShow);
    this.b_ShowPointRect=bShow;
	this.RepaintControl; 
}

//是否允许改变图形大小
function ChangeFigureSize(bChange)			
{
    this.b_ChangeFigureSize=bChange;	
	return  this.m_nCursorInFigureId;
}


//获取指定图形信息，返回一个指针可以修改Figure信息
function GetFigure(nFigureId)
{
	if (this.m_FiguresSet.m_nFigureCount>0)
	{ 
		for(var index=0;index<this.m_FiguresSet.m_nFigureCount;index++)
		{  				
			if(this.m_FiguresSet.m_Figures[index].figure_id==nFigureId)
			{
				return this.m_FiguresSet.m_Figures[index];
			}
		} 
	}  
	
	return -1;
}


function GetFigureData()
{
	return this.m_FiguresSet
}

function GetFigureCount()
{
	return this.m_FiguresSet.m_nFigureCount;
}
//获得给定图形类型
function GetFigureType(id,type)	
{

}

//获取指定图形点个数
function GetFigurePointNum(nFigureId)
{}
//获取图形的点集合,点的坐标为相对于图像左上点而言的位置 		
//BOOL   CPoint PointData[],int nPointNum)
function GetFigurePoints(PointData,nPointNum)				
{}
//获得当前图像与(0,0)的偏移 如果返回为true获取成功，如果为false，超出图像范围
//CPoint 
function GetShiftDistance()					
{}
//获得当前鼠标在图像中的位置
//BOOL  PointData[MaxCPointCount]
function GetCurrentCusorInImage(PointData)					
{}
//获得当前选中的图形ID集合
//const int*   int idNum
function GetCurrentSelectFigureIdSet(idNum)	
{}
//获得当前的放大倍数
//float 
function GetZoomRate()					
{}
//设置当前缩放系数
//float 
function SetZoomRate(fRate)			
{}
//返回鼠标选中图形id
//int 
function GetCurrentSelectFigureId()			
{
	return this.m_nCursorInFigureId;
}
//获得最后一个图形形ID
//int 
function GetLastFigureId()				
{}
//bool 
function GetFigureDrawStatus()
{}
//设置当前绘图颜色
function SetDrawFigureColor(COLORREF )				
{
	this.m_FigureColor=COLORREF;
}
//修改图形ID
//BOOL 
function SetFigureId(nOldFigureId,nNewFigureId)
{}
//控件与窗口的偏移 
//BOOL 		
function setControlShiftDistance(nX,nY)			
{}
//设置指定图形移动距离
//BOOL 
function setFigureShiftDistance(nId,nX ,nY)
{}

//设置指定图形颜色
function SetFigureColor(figureColor,nFigureId)			
{
	if (this.m_FiguresSet.m_nFigureCount>0)
		{ 
			for(var index=0;index<this.m_FiguresSet.m_nFigureCount;index++)
			{  
				
				if(this.m_FiguresSet.m_Figures[index].figure_id==nFigureId)
				{
					this.m_FiguresSet.m_Figures[index].figure_color=figureColor;
				}
			} 
		}  
}



function FillFigure(nFigureId,color)
{	
	if (this.m_FiguresSet.m_nFigureCount>0)
	{ 
		for(var index=0;index<this.m_FiguresSet.m_nFigureCount;index++)
		{  
			
			if(this.m_FiguresSet.m_Figures[index].figure_id==nFigureId)
			{
				this.m_FiguresSet.m_Figures[index].figure_fill.b_fill=true;
				this.m_FiguresSet.m_Figures[index].figure_fill.figure_color=color;
				this.FillFigureRect(this.m_FiguresSet.m_Figures[index]);
				this.RepaintControl();
				break;
			}
		} 
	}  
	this.AddFigureHis(this.m_FiguresSet);
	
}

function CancelFillFigure(nFigureId)
{
	if (this.m_FiguresSet.m_nFigureCount>0)
	{ 
		for(var index=0;index<this.m_FiguresSet.m_nFigureCount;index++)
		{  
			
			if(this.m_FiguresSet.m_Figures[index].figure_id==nFigureId)
			{
				this.m_FiguresSet.m_Figures[index].figure_fill.b_fill=false;
			}
		} 
	}  
	this.AddFigureHis(this.m_FiguresSet);
	this.RepaintControl();
}


function FillFigureRect(data) //填充图形 
{
	if (data.figure_fill.b_fill==true)
	{ 
	//填充多边形
		if (data.figure_type==PolyType ||data.figure_type==RectType)
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
		
			this.m_Context.fillStyle =data.figure_fill.figure_color;
			this.m_Context.lineWidth=2;
			this.m_Context.beginPath();
			this.m_Context.moveTo(GetIntValue(FindIterator.x*this.m_fZoomNum)+MovePoint.x+data.shift_x,GetIntValue(FindIterator.y*this.m_fZoomNum)+MovePoint.y+data.shift_y);  
			
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
				this.m_Context.lineTo(GetIntValue(FindIterator.x*this.m_fZoomNum)+MovePoint.x+data.shift_x,
				GetIntValue(FindIterator.y*this.m_fZoomNum)+MovePoint.y+data.shift_y);
				
			}
			FindIterator=data.figure_data.m_CPoint[0];	
			this.m_Context.fillStyle =data.figure_fill.figure_color;
			this.m_Context.lineTo(GetIntValue(FindIterator.x*this.m_fZoomNum)+MovePoint.x+data.shift_x,
			GetIntValue(FindIterator.y*this.m_fZoomNum)+MovePoint.y+data.shift_y);		

			this.m_Context.fill();
		 
		} 
		//填充圆形
		else if (data.figure_type==CircleType)
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
			
			this.m_Context.fillStyle = data.figure_fill.figure_color;
			this.m_Context.strokeStyle = data.figure_color;
			this.m_Context.arc(x / ratioX, y / ratioY, r, 0, 2 * Math.PI, false);
			this.m_Context.fill();
			this.m_Context.restore();
			
		} 
		else if (data.figure_type==DrectType)
		{
			var TempFillRect=new CRect(0,0,0,0);
			this.m_Context.fillStyle=data.figure_fill.figure_color;

			TempFillRect.left=GetIntValue(data.figure_rect_outside.left*this.m_fZoomNum+this.OriginalPoint_Bitmap.x)+data.shift_x;	
			TempFillRect.right=GetIntValue(data.figure_rect.left*this.m_fZoomNum+this.OriginalPoint_Bitmap.x)+data.shift_x;
			TempFillRect.top=GetIntValue(data.figure_rect_outside.top*this.m_fZoomNum+this.OriginalPoint_Bitmap.y)+data.shift_y;
			TempFillRect.bottom=GetIntValue(data.figure_rect_outside.bottom*this.m_fZoomNum+this.OriginalPoint_Bitmap.y)+data.shift_y;				
			this.m_Context.fillRect(TempFillRect.left,TempFillRect.top,TempFillRect.Width(),TempFillRect.Height());

			TempFillRect.left=GetIntValue(data.figure_rect.right*this.m_fZoomNum+this.OriginalPoint_Bitmap.x)+data.shift_x;	
			TempFillRect.right=GetIntValue(data.figure_rect_outside.right*this.m_fZoomNum+this.OriginalPoint_Bitmap.x)+data.shift_x;
			TempFillRect.top=GetIntValue(data.figure_rect_outside.top*this.m_fZoomNum+this.OriginalPoint_Bitmap.y)+data.shift_y;
			TempFillRect.bottom=GetIntValue(data.figure_rect_outside.bottom*this.m_fZoomNum+this.OriginalPoint_Bitmap.y)+data.shift_y;				
			this.m_Context.fillRect(TempFillRect.left,TempFillRect.top,TempFillRect.Width(),TempFillRect.Height());

			TempFillRect.left=GetIntValue(data.figure_rect.left*this.m_fZoomNum+this.OriginalPoint_Bitmap.x)+data.shift_x;
			TempFillRect.top=GetIntValue(data.figure_rect_outside.top*this.m_fZoomNum+this.OriginalPoint_Bitmap.y)+data.shift_y;		
			TempFillRect.right=GetIntValue(data.figure_rect.right*this.m_fZoomNum+this.OriginalPoint_Bitmap.x)+data.shift_x;
			TempFillRect.bottom=GetIntValue(data.figure_rect.top*this.m_fZoomNum+this.OriginalPoint_Bitmap.y)+data.shift_y;				
			this.m_Context.fillRect(TempFillRect.left,TempFillRect.top,TempFillRect.Width(),TempFillRect.Height());

			TempFillRect.left=GetIntValue(data.figure_rect.left*this.m_fZoomNum+this.OriginalPoint_Bitmap.x)+data.shift_x;
			TempFillRect.top=GetIntValue(data.figure_rect.bottom*this.m_fZoomNum+this.OriginalPoint_Bitmap.y)+data.shift_y;		
			TempFillRect.right=GetIntValue(data.figure_rect.right*this.m_fZoomNum+this.OriginalPoint_Bitmap.x)+data.shift_x;
			TempFillRect.bottom=GetIntValue(data.figure_rect_outside.bottom*this.m_fZoomNum+this.OriginalPoint_Bitmap.y)+data.shift_y;				
			this.m_Context.fillRect(TempFillRect.left,TempFillRect.top,TempFillRect.Width(),TempFillRect.Height());
		}
	} 	
}


//设置图形的名称
function SetFigureName(figureName,FigureId)
{
	if (this.m_FiguresSet.m_nFigureCount>0)
	{ 
		for(var index=0;index<this.m_FiguresSet.m_nFigureCount;index++)
		{  
			
			if(this.m_FiguresSet.m_Figures[index].figure_id==nFigureId)
			{
				this.m_FiguresSet.m_Figures[index].figure_name=figureName;
				return;
			}
		} 
	}  
}
//设置指定图形的保留字段内容  void *ReservedData,int FigureId
function SetFigureReservedData(ReservedData,FigureId)
{}
//指定当前选中的图形
function SetCurrentSelectFigure(nId)				
{}

//设置初始背景颜色
//bshowAlways 是否背景颜色一直显示
function SetBackGroundColor(color,bshowAlways)		
{
	this.m_InitBackGroundColor=color;
	this.b_BShowBackGround=bshowAlways;
	this.RepaintControl();
}
//图像平移距离
function SetFigureShiftDistance(nX ,nY)
{}
//移动所有图形
function SetMoveAllFigures(bMove)
{
	this.b_MoveAllFigures=bMove;
}
//设置图像根据当前控件大小缩放
function SetFitFillControl()
{
	var nImageWidth=this.m_Image.width;
	var nImageHeight=this.m_Image.height;
	var nWidth=this.m_ClientRect.Width();
	var nHeight=this.m_ClientRect.Height();
	var TempNum,fZoomNum=1;	
	TempNum=(nHeight*1.0/nImageHeight);
	fZoomNum=TempNum;

	TempNum=(nWidth*1.0/nImageWidth);
	if (fZoomNum>TempNum)
	{
		fZoomNum=TempNum;
	}
	var fMinValue=1.0;
	var fMinValue=10000.0;
	var scale=FigureControl_ScaleBot;
	for (var i=FigureControl_MaxZoomScale;i<FigureControl_MaxZoomScale*-1;i++)
	{
		if (Math.abs(Math.pow(scale,i)-fZoomNum)<fMinValue)
		{
			fMinValue=Math.abs(Math.pow(scale,i)-fZoomNum);
			this.m_nScrollRate=i;
		}
	}
	this.m_fZoomNum=Math.pow(scale,this.m_nScrollRate);
	this.RepaintControl();
}
//设置是否显示外围图形框
function SetShowFigureOutsideLine(bSHow,COLORREF)
{}
//添加禁止拖动图像id
//BOOL 
function AddForbiddenFigureId(nFigureId)
{}

//删除禁止拖动图像id
//BOOL 
function DeleteForbiddenFigureId(nFigureId)		
{}
//设置当前矩形为正方形
//BOOL 
function SetRectToSquare(FigureId)
{}
//旋转图形
//BOOL 
function RotateFigure(nAngle,CenterPoint,nFigureId)
{}
//缩放图形
//BOOL 
function ZoomFigure(fZoomRate,CenterPoint,nFigureId)
{}

/************************************************************************/
/* 
设置标记点
show  是否显示
LabelPoint 屏幕坐标
bOutSide  是否是外部坐标                                                                    
*/
/************************************************************************/
function  ShowPositionLabel(b_show,LabelPoint,bOutSide)		
{
	if (b_show==true)
	{ 
		var tempPoint=new CPoint;  
		if (bOutSide==true)
		{
			LabelPoint.x-=this.x_Distance;
			LabelPoint.y-=this.y_Distance;
			if (PointInRect(LabelPoint,this.m_ClientRect))
			{
				tempPoint.x=GetIntValue((LabelPoint.x-this.OriginalPoint_Bitmap.x)/this.m_fZoomNum);
				tempPoint.y=GetIntValue((LabelPoint.y-this.OriginalPoint_Bitmap.y)/this.m_fZoomNum); 
				PointEqual(this.m_PositionLabel,tempPoint);
			} 
		}
		else
			PointEqual(this.m_PositionLabel,LabelPoint);		
			this.b_ShowPositionLabel=true;
	}
	else if(b_show==false)
	{
		this.b_ShowPositionLabel=false;
		this.m_PositionLabel.x=0;
		this.m_PositionLabel.y=0;
	}
	this.RepaintControl();
}

/* 用于修改控件内部图像数据内容  
注：修改后数据无法还原
所有通道的图像在控件内部都转换为RGBA处理，当需要修改单通道时，可以将RGB值都设为一样
*/
/************************************************************************/
//修改图像单像素
//BOOL 
function SetImagePix(pt,nRValue,nGValue,nBValue)				
{}
//获取图像单像素内容
//BOOL  CPoint pt,int RValue,int nGValue,int nBValue
function GetImagePix(pt,RValue,nGValue,nBValue) 
{}


//回到初始位置 
function BackToInitFigure()	
{
	this.SetFitFillControl();
	this.ShiftImageToCenter();
	this.bFitFigureSize=false;
	this.RepaintControl();
}
//清除当前绘制状态
function ClearDrawStatus()	
{
	this.b_DrawCircle=false;
	this.b_DrawDoubleRect=false;
	this.b_DrawRect=false; 
	this.b_DrawPoly=false; 
	this.b_ShowPositionLabel=false;
	this.b_PreDrawCircle=false;
	this.b_PreDrawDoubleRect=false;
	this.b_PreDrawRect=false;
	this.m_PositionLabel.x=0;
	this.m_PositionLabel.y=0;
	this.SelectFigureId=0;
	this.m_nCursorInFigureId =0;
	this.b_LButtonDouC=false;		
	this.b_SubFiguresMove=true;
	this.m_TempLinesPointSet=new figure_data;
	this.m_SelectSubFigureRectIdSet=new FiguresIDSet;
	this.CurrentFigure=new Figure();
    this.RepaintControl();
}

//删除所有图形
function ClearAllFigures()					
{	
	this.AddFigureHis(this.m_FiguresSet);		
	this.m_nCursorInFigureId=0;
	this.m_nHorDistance = 0;
	this.m_nVerDistance = 0;
	this.m_nHorDistanceIntv = 0;
	this.m_nVerDistanceIntv = 0;

	this.m_FiguresSet=new FiguresSet;
	this.m_TempLinesPointSet=new figure_data;
	this.ForbiddenMoveFigureIdSet=new Array(FigureControl_MaxFigureCount);
	this.m_SelectSubFigureRectIdSet=new FiguresIDSet;
    this.RepaintControl();
}



function AddFigureHis(figureSet)
{
	if(deepCompare(figureSet,this.m_FiguresSetHis[0]))
	return;
	
	this.FigureHisIndex=0;
	for(var index=FigureControl_HisCount-1;index>0;index--)
	{
		this.m_FiguresSetHis[index]=this.m_FiguresSetHis[index-1];
	}
	this.m_FiguresSetHis[0]=cloneObj(figureSet);
	//console.log(figureSet);	
}

function BackHis()
{
	this.FigureHisIndex++;

	if(this.FigureHisIndex>=FigureControl_HisCount)
	{
		this.FigureHisIndex=FigureControl_HisCount-1;
		return -1;
	}

	this.m_FiguresSet=cloneObj(this.m_FiguresSetHis[this.FigureHisIndex]);
	this.RepaintControl();
}


function ForwHis()
{
	this.FigureHisIndex--;
	
	if(this.FigureHisIndex<0)
	{
		this.FigureHisIndex=0;
		return -1;
	}
	

	this.m_FiguresSet=cloneObj(this.m_FiguresSetHis[this.FigureHisIndex]);
	this.RepaintControl();
}


function SetPolyPointCount(nPointCount)
{
	this.m_PolyPointCount=nPointCount;
}

function FitFigureSize(nFigureId)
{
	var figureData = this.GetFigure(nFigureId);
	if (figureData<1)
	{
		return;
	}
	

	var rect=new CRect;
	rect=GetBrowserPosition(this.m_Canvas);	

	var figureRect=new CRect;

	if(figureData.figure_type == DrectType)
	{
		figureRect.left=figureData.figure_rect_outside.left;
		figureRect.right=figureData.figure_rect_outside.right;
		figureRect.top=figureData.figure_rect_outside.top;
		figureRect.bottom=figureData.figure_rect_outside.bottom;
	}
	else if(figureData.figure_type == PolyType)
	{
		var left=100000,right=0,top=1000000,bottom=0;
		for(var index=0;index<figureData.figure_data.nCPointCount;index++)
		{
			if(figureData.figure_data.m_CPoint[index].x<left)
				left=figureData.figure_data.m_CPoint[index].x;
			if(figureData.figure_data.m_CPoint[index].y<top)
				top=figureData.figure_data.m_CPoint[index].y;

			if(figureData.figure_data.m_CPoint[index].x>right)
				right=figureData.figure_data.m_CPoint[index].x;
			if(figureData.figure_data.m_CPoint[index].y>bottom)
				bottom=figureData.figure_data.m_CPoint[index].y;
		}
		
		figureRect.left=left;
		figureRect.right=right;
		figureRect.top=top;
		figureRect.bottom=bottom;
	}
	else
	{
		figureRect.left=figureData.figure_rect.left;
		figureRect.right=figureData.figure_rect.right;
		figureRect.top=figureData.figure_rect.top;
		figureRect.bottom=figureData.figure_rect.bottom;
	}
	

	var fZoomNum = 1;
	var TempNum = (rect.Height()*1.0 / (figureRect.Height()*1.2));
	fZoomNum = TempNum;

	TempNum = (rect.Width()*1.0 / (figureRect.Width()*1.2));
	if (fZoomNum > TempNum)
	{
		fZoomNum = TempNum;
	}
	var fMinValue = 10000.0;
	for (var i = FigureControl_MaxZoomScale; i < FigureControl_MaxZoomScale*-1; i++)
	{
		if (Math.abs(Math.pow(FigureControl_ScaleBot, i) - fZoomNum) < fMinValue)
		{
			fMinValue = Math.abs(Math.pow(FigureControl_ScaleBot, i) - fZoomNum);
			this.m_nScrollRate = i;
		}
	}
	this.m_fZoomNum = Math.pow(FigureControl_ScaleBot, this.m_nScrollRate);

	this.OriginalPoint_Bitmap.x = (this.m_ClientRect.Width()/2 - this.m_fZoomNum*( figureRect.left +figureRect.Width() / 2 ));
	this.OriginalPoint_Bitmap.y = (this.m_ClientRect.Height()/2 - this.m_fZoomNum*( figureRect.top +figureRect.Height()/2));
	this.bFitFigureSize=true;
	this.RepaintControl();
}
