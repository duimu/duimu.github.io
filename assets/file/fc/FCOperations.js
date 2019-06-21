
//RectCorner
var LeftTop=0,RightTop=1,RightBottom=2,LeftBottom=3;

// External User Event Operations
//外部事件操作
function MouseWheel(zDelta, pt)  //滚动鼠标中建
{
	pt.x-=this.x_Distance;
	pt.y-=this.y_Distance;
 
	if (!PointInCurrentRect(this.m_ClientRect,pt))
	{
		this.b_CursorInOutSide=true;
		return;
	} 
	else
	{
		this.b_CursorInOutSide=false;
	}

	if (this.b_DrawRect || this.b_DrawPoly ||this.b_DrawCircle ||this.b_LeftButtonDown ||this.b_DrawDoubleRect)
	{
		return;
	}
	PointEqual(this.m_MovePoint_cursor,pt);  

	//理论上zDelta每次都是120或者-120 	
	var zoomCount=(zDelta/120);  
	var x1=0,x2=0,y1=0,y2=0;
	var	InImageWidth=0,InImageHight=0;
	InImageWidth=(this.m_MovePoint_cursor.x-this.OriginalPoint_Bitmap.x)/this.m_fZoomNum;
	InImageHight=(this.m_MovePoint_cursor.y-this.OriginalPoint_Bitmap.y)/this.m_fZoomNum;
	if (zoomCount>0)
	{   //最大放大倍率		
		if (this.m_nScrollRate<FigureControl_MaxZoomScale)
		{
			return false; 
		}
		var nScrolRate = this.m_nScrollRate - 1;
		var fData = Math.pow(FigureControl_ScaleBot, nScrolRate);
		if (fData>FigureControl_MaxZoomRate)
		{
			return false;
		}
		this.m_nScrollRate= nScrolRate;

		//this.m_nScrollRate--;
		this.m_fZoomNum=Math.pow(FigureControl_ScaleBot,this.m_nScrollRate);  
		var TestX=0,TestY=0;
		TestX=InImageWidth*(this.m_fZoomNum-Math.pow(FigureControl_ScaleBot,this.m_nScrollRate+1));
		TestY=InImageHight*(this.m_fZoomNum-Math.pow(FigureControl_ScaleBot,this.m_nScrollRate+1));
		this.OriginalPoint_Bitmap.x=GetIntValue(this.OriginalPoint_Bitmap.x-TestX); 
		this.OriginalPoint_Bitmap.y=GetIntValue(this.OriginalPoint_Bitmap.y-TestY);

	} 
	else
	{	 
		if (this.m_nScrollRate>-2*FigureControl_MaxZoomScale)
		{
			return false;
		}
		var nScrollRate = this.m_nScrollRate + 1;
		var fZoom= Math.pow(FigureControl_ScaleBot, nScrollRate);
		if (Math.abs(fZoom)<FigureControl_MinZoorRate)
		{
			return false;
		}

		this.m_nScrollRate++;
		this.m_fZoomNum=Math.pow(FigureControl_ScaleBot,this.m_nScrollRate); 
		var TestX=0,TestY=0;
		TestX=(InImageWidth*(this.m_fZoomNum- Math.pow(FigureControl_ScaleBot,this.m_nScrollRate-1)));
		TestY=(InImageHight*(this.m_fZoomNum- Math.pow(FigureControl_ScaleBot,this.m_nScrollRate-1)));
		this.OriginalPoint_Bitmap.x=GetIntValue(this.OriginalPoint_Bitmap.x-TestX); 
		this.OriginalPoint_Bitmap.y=GetIntValue(this.OriginalPoint_Bitmap.y-TestY);
	}     
	
	this.RepaintControl();  
}
    
function MouseMove(point)			 //移动鼠标
{
	var bInvalidate=0;
	point.x-=this.x_Distance;
	point.y-=this.y_Distance;  
	var nSelectRectSize=GetIntValue(2+Math.abs(1/this.m_fZoomNum));
	if (!PointInCurrentRect(this.m_ClientRect,point))
	{
		this.b_CursorInOutSide=true;
		return;
	} 
	else
	{
		this.b_CursorInOutSide=false;
	}
	
	PointEqual(this.m_MovePoint_cursor,point);  

	
	//如果画图形时，鼠标移动到对象图外
	if ((this.b_DrawRect || this.b_DrawPoly ||this.b_DrawCircle) && this.PointGoOutSide(this.m_MovePoint_cursor))
	{
		return;
	} 

	var tempPoint=new CPoint(0,0);
	tempPoint.x=this.m_MovePoint_cursor.x+FigureControl_DoubleRectDistance;
	tempPoint.y=this.m_MovePoint_cursor.y+FigureControl_DoubleRectDistance;
	if (this.PointGoOutSide(tempPoint) && this.b_DrawDoubleRect)
	{
		return;
	}

	//console.log(this.m_bMouseClickFlag);
	if(this.m_bMouseClickFlag)
	{
		this.m_cpCurrentPoint_cursor.x=point.x;
		this.m_cpCurrentPoint_cursor.y=point.y;  	
		

		this.m_cpDistancePoint.x=this.m_cpCurrentPoint_cursor.x-this.m_cpOriginalPoint_cursor.x;
		this.m_cpDistancePoint.y=this.m_cpCurrentPoint_cursor.y-this.m_cpOriginalPoint_cursor.y;   


		//console.log(this.m_cpDistancePoint.x,this.m_cpDistancePoint.y,this.m_cpCurrentPoint_cursor.x,this.m_cpCurrentPoint_cursor.y,point.x,point.y);

		var m_cpCurrentPoint_cursor=new CPoint(0,0);
		PointEqual(m_cpCurrentPoint_cursor,point);  
		

		//拉动图形边缘点		 
		if (this.b_FigurePointSelect&&  !this.PointGoOutSide(this.m_cpCurrentPoint_cursor))
		{
			var Index=0;
			var Iterator=new Figure; 
			for(Index;Index<this.m_FiguresSet.m_nFigureCount;Index++)
			{
				Iterator=this.m_FiguresSet.m_Figures[Index];
				var b_find=0;
				var b_RelativeWindow=false;
				var distance=0;
				varcurrentFigurePos=-1;
				
				if (Iterator.figure_id==this.CurrentSelectPoint.Figure_id)
				{				
					if ( Iterator.figure_type==RectType || Iterator.figure_type==PolyType)
					{  
						var FindIterator=new CPoint(0,0);
						var FindIndex=0;
						var pointNum=0 //当前移动到第几个点
						var nSquredMoveDistance=0;
						for(FindIndex;FindIndex<Iterator.figure_data.nCPointCount;FindIndex++)
						{
							pointNum++; 
							FindIterator=Iterator.figure_data.m_CPoint[FindIndex];
							
							if ((FindIterator.x==this.CurrentSelectPoint.Figure_point.x  && FindIterator.y==this.CurrentSelectPoint.Figure_point.y))
							{
								if (Iterator.figure_type==PolyType)
								{		
									FindIterator.x=GetIntValue((this.m_cpCurrentPoint_cursor.x-this.OriginalPoint_Bitmap.x)/this.m_fZoomNum);
									FindIterator.y=GetIntValue((this.m_cpCurrentPoint_cursor.y-this.OriginalPoint_Bitmap.y)/this.m_fZoomNum);
									
									this.CurrentSelectPoint.Figure_point.x=FindIterator.x;
									this.CurrentSelectPoint.Figure_point.y=FindIterator.y; 
								}
								if ( Iterator.figure_type==RectType)
								{									
									var nMoveDistance_x=GetIntValue((this.m_cpCurrentPoint_cursor.x-this.OriginalPoint_Bitmap.x)/this.m_fZoomNum)-FindIterator.x; 
									var nMoveDistance_y=GetIntValue((this.m_cpCurrentPoint_cursor.y-this.OriginalPoint_Bitmap.y)/this.m_fZoomNum)-FindIterator.y; 
									nSquredMoveDistance=nMoveDistance_x;
									
									switch (pointNum)
									{
									case 1:  //第一个点
										if (Iterator.bShowSqure)
										{											
											FindIterator.x+=nSquredMoveDistance;
											FindIterator.y+=nSquredMoveDistance;
											FindIterator=Iterator.figure_data.m_CPoint[1];
											
											FindIterator.x-=nSquredMoveDistance;
											FindIterator.y+=nSquredMoveDistance;
											FindIterator=Iterator.figure_data.m_CPoint[2];
											FindIterator.x-=nSquredMoveDistance;
											FindIterator.y-=nSquredMoveDistance;

											FindIterator=Iterator.figure_data.m_CPoint[3];
											FindIterator.x+=nSquredMoveDistance;
											FindIterator.y-=nSquredMoveDistance;											
										}
										else
										{
											var pt=new CPoint(0,0);			
											pt.x=GetIntValue((this.m_cpCurrentPoint_cursor.x-this.OriginalPoint_Bitmap.x)/this.m_fZoomNum);
											pt.y=GetIntValue((this.m_cpCurrentPoint_cursor.y-this.OriginalPoint_Bitmap.y)/this.m_fZoomNum);										
											
											Iterator.figure_data.m_CPoint[0].x=pt.x;
											Iterator.figure_data.m_CPoint[0].y=pt.y;
											
											Iterator.figure_data.m_CPoint[1].y=pt.y;
											
											Iterator.figure_data.m_CPoint[3].x=pt.x;			
										}				
										break;						
									case 2:
										if (Iterator.bShowSqure)
										{
											FindIterator=Iterator.figure_data.m_CPoint[0];
											FindIterator.x-=nSquredMoveDistance;
											FindIterator.y-=nSquredMoveDistance;
											FindIterator=Iterator.figure_data.m_CPoint[1];
											FindIterator.x+=nSquredMoveDistance;
											FindIterator.y-=nSquredMoveDistance;
											FindIterator=Iterator.figure_data.m_CPoint[2];
											FindIterator.x+=nSquredMoveDistance;
											FindIterator.y+=nSquredMoveDistance;
											FindIterator=Iterator.figure_data.m_CPoint[3];
											FindIterator.x-=nSquredMoveDistance;
											FindIterator.y+=nSquredMoveDistance;										
										}
										else
										{
											var pt=new CPoint(0,0);				
											pt.x=GetIntValue((this.m_cpCurrentPoint_cursor.x-this.OriginalPoint_Bitmap.x)/this.m_fZoomNum);
											pt.y=GetIntValue((this.m_cpCurrentPoint_cursor.y-this.OriginalPoint_Bitmap.y)/this.m_fZoomNum);											
											
											Iterator.figure_data.m_CPoint[1].x=pt.x;
											Iterator.figure_data.m_CPoint[1].y=pt.y;
											
											Iterator.figure_data.m_CPoint[0].y=pt.y;
											
											Iterator.figure_data.m_CPoint[2].x=pt.x;												
										}										
										break;
									case 3:
										if (Iterator.bShowSqure)
										{
											FindIterator=Iterator.figure_data.m_CPoint[0];
											FindIterator.x-=nSquredMoveDistance;
											FindIterator.y-=nSquredMoveDistance;
											FindIterator=Iterator.figure_data.m_CPoint[1];
											FindIterator.x+=nSquredMoveDistance;
											FindIterator.y-=nSquredMoveDistance;											
											FindIterator=Iterator.figure_data.m_CPoint[2];
											FindIterator.x+=nSquredMoveDistance;
											FindIterator.y+=nSquredMoveDistance;
											FindIterator=Iterator.figure_data.m_CPoint[3];
										}
										else
										{
											var pt=new CPoint(0,0);				
											pt.x=GetIntValue((this.m_cpCurrentPoint_cursor.x-this.OriginalPoint_Bitmap.x)/this.m_fZoomNum);
											pt.y=GetIntValue((this.m_cpCurrentPoint_cursor.y-this.OriginalPoint_Bitmap.y)/this.m_fZoomNum);											
											
											Iterator.figure_data.m_CPoint[2].x=pt.x;
											Iterator.figure_data.m_CPoint[2].y=pt.y;
											
											Iterator.figure_data.m_CPoint[1].x=pt.x;
											
											Iterator.figure_data.m_CPoint[3].y=pt.y;											
										}										
										break;
									case 4:
										if (Iterator.bShowSqure)
										{
											FindIterator.x+=nSquredMoveDistance;
											FindIterator.y-=nSquredMoveDistance;
											FindIterator=Iterator.figure_data.m_CPoint[2];
											FindIterator.x-=nSquredMoveDistance;
											FindIterator.y-=nSquredMoveDistance;
											FindIterator=Iterator.figure_data.m_CPoint[1];
											FindIterator.x-=nSquredMoveDistance;
											FindIterator.y+=nSquredMoveDistance;
											FindIterator=Iterator.figure_data.m_CPoint[0];
											FindIterator.x+=nSquredMoveDistance;
											FindIterator.y+=nSquredMoveDistance;
										}
										else
										{
											var pt=new CPoint(0,0);			
											pt.x=GetIntValue((this.m_cpCurrentPoint_cursor.x-this.OriginalPoint_Bitmap.x)/this.m_fZoomNum);
											pt.y=GetIntValue((this.m_cpCurrentPoint_cursor.y-this.OriginalPoint_Bitmap.y)/this.m_fZoomNum);										
											
											Iterator.figure_data.m_CPoint[3].x=pt.x;
											Iterator.figure_data.m_CPoint[3].y=pt.y;
											
											Iterator.figure_data.m_CPoint[2].y=pt.y;
											
											Iterator.figure_data.m_CPoint[0].x=pt.x;										
										}										
										break;
									default:
										break;
									}			
										this.CurrentSelectPoint.Figure_point.x=FindIterator.x;
										this.CurrentSelectPoint.Figure_point.y=FindIterator.y; 						
									b_find=1;
									break; //找到该点后退出
								}
							} //end of list of point//*/
							if ((Iterator.figure_type==RectType  &&this.CurrentSelectPoint.nPointIndex>=5))
							{
								//中间点								
								FindIterator=Iterator.figure_data.m_CPoint[0];
								var pt=new CPoint(0,0);	
								switch(this.CurrentSelectPoint.nPointIndex)
								{
								case 5:		
									pt.y=GetIntValue((this.m_cpCurrentPoint_cursor.y-this.OriginalPoint_Bitmap.y)/this.m_fZoomNum);
									FindIterator.y=GetIntValue((this.m_cpCurrentPoint_cursor.y-this.OriginalPoint_Bitmap.y)/this.m_fZoomNum);
									FindIterator=Iterator.figure_data.m_CPoint[1];
									FindIterator.y=GetIntValue((this.m_cpCurrentPoint_cursor.y-this.OriginalPoint_Bitmap.y)/this.m_fZoomNum);
									break;
								case 6:			
									pt.x=GetIntValue((this.m_cpCurrentPoint_cursor.x-this.OriginalPoint_Bitmap.x)/this.m_fZoomNum);									
									FindIterator=Iterator.figure_data.m_CPoint[1];
									FindIterator.x=GetIntValue((this.m_cpCurrentPoint_cursor.x-this.OriginalPoint_Bitmap.x)/this.m_fZoomNum);
									FindIterator=Iterator.figure_data.m_CPoint[2];
									FindIterator.x=GetIntValue((this.m_cpCurrentPoint_cursor.x-this.OriginalPoint_Bitmap.x)/this.m_fZoomNum);	
									break;
								case 7:		
									pt.y=GetIntValue((this.m_cpCurrentPoint_cursor.y-this.OriginalPoint_Bitmap.y)/this.m_fZoomNum);								
									FindIterator=Iterator.figure_data.m_CPoint[2];
									FindIterator.y=GetIntValue((this.m_cpCurrentPoint_cursor.y-this.OriginalPoint_Bitmap.y)/this.m_fZoomNum);
									FindIterator=Iterator.figure_data.m_CPoint[3];
									FindIterator.y=GetIntValue((this.m_cpCurrentPoint_cursor.y-this.OriginalPoint_Bitmap.y)/this.m_fZoomNum);	
									break;
								case 8:		
									pt.x=GetIntValue((this.m_cpCurrentPoint_cursor.x-this.OriginalPoint_Bitmap.x)/this.m_fZoomNum);
									FindIterator.x=GetIntValue((this.m_cpCurrentPoint_cursor.x-this.OriginalPoint_Bitmap.x)/this.m_fZoomNum);
									FindIterator=Iterator.figure_data.m_CPoint[3];
									FindIterator.x=GetIntValue((this.m_cpCurrentPoint_cursor.x-this.OriginalPoint_Bitmap.x)/this.m_fZoomNum);	
									break;
								default:
									break;
								}								
								b_find=1;
								//break; //找到该点后退出
							}
						} 	 //end of recttype ,polytype
					}
					if(Iterator.figure_type==CircleType)
					{ 
						var pt=new Array(5);
						for(var index=0;index<5;index++)
						pt[index]=new CPoint(0,0);
						
						pt[1].x=Iterator.figure_rect.left+GetIntValue((Iterator.figure_rect.right-Iterator.figure_rect.left)/2);
						pt[1].y=Iterator.figure_rect.top; 
						pt[2].x=Iterator.figure_rect.right;
						pt[2].y=Iterator.figure_rect.top+GetIntValue((Iterator.figure_rect.bottom-Iterator.figure_rect.top)/2); 
						pt[3].x=Iterator.figure_rect.left+GetIntValue((Iterator.figure_rect.right-Iterator.figure_rect.left)/2);
						pt[3].y=Iterator.figure_rect.bottom; 
						pt[4].x=Iterator.figure_rect.left;
						pt[4].y=Iterator.figure_rect.top+GetIntValue((Iterator.figure_rect.bottom-Iterator.figure_rect.top)/2);

						for (var i=1;i<=4;i++)
						{	  
							if(Math.abs(pt[i].x-this.CurrentSelectPoint.Figure_point.x)<=nSelectRectSize 
							&& Math.abs(pt[i].y-this.CurrentSelectPoint.Figure_point.y)<=nSelectRectSize)
							{

								switch(i)
								{
								case 1:
									Iterator.figure_rect.top=GetIntValue((this.m_cpCurrentPoint_cursor.y-this.OriginalPoint_Bitmap.y)/this.m_fZoomNum); //存入图像点
									this.CurrentSelectPoint.Figure_point.y=Iterator.figure_rect.top;									
									break;
								case 2:									
									Iterator.figure_rect.right=GetIntValue((this.m_cpCurrentPoint_cursor.x-this.OriginalPoint_Bitmap.x)/this.m_fZoomNum);
									this.CurrentSelectPoint.Figure_point.x=Iterator.figure_rect.right;
									break;
								case 3:
									Iterator.figure_rect.bottom=GetIntValue((this.m_cpCurrentPoint_cursor.y-this.OriginalPoint_Bitmap.y)/this.m_fZoomNum);
									this.CurrentSelectPoint.Figure_point.y=Iterator.figure_rect.bottom;									
									break;
								case 4:
									Iterator.figure_rect.left=GetIntValue((this.m_cpCurrentPoint_cursor.x-this.OriginalPoint_Bitmap.x)/this.m_fZoomNum);
									this.CurrentSelectPoint.Figure_point.x=Iterator.figure_rect.left;
									break;
								default:
									break;									
								} 
								b_find=1;
								break;
							}
						}
					}
					if (Iterator.figure_type==DrectType)
					{
						var pt=new Array(9);
						for(var index=0;index<9;index++)
						pt[index]=new CPoint(0,0);
						
						pt[1].x=Iterator.figure_rect.left;
						pt[1].y=Iterator.figure_rect.top;
						pt[2].x=Iterator.figure_rect.right;
						pt[2].y=Iterator.figure_rect.top;
						pt[3].x=Iterator.figure_rect.right;
						pt[3].y=Iterator.figure_rect.bottom;
						pt[4].x=Iterator.figure_rect.left;
						pt[4].y=Iterator.figure_rect.bottom;
						pt[5].x=Iterator.figure_rect_outside.left;
						pt[5].y=Iterator.figure_rect_outside.top;
						pt[6].x=Iterator.figure_rect_outside.right;
						pt[6].y=Iterator.figure_rect_outside.top;
						pt[7].x=Iterator.figure_rect_outside.right;
						pt[7].y=Iterator.figure_rect_outside.bottom;
						pt[8].x=Iterator.figure_rect_outside.left;
						pt[8].y=Iterator.figure_rect_outside.bottom;  
						for (var i=1;i<=8;i++)
						{	 
							if(Math.abs(pt[i].x-this.CurrentSelectPoint.Figure_point.x)<nSelectRectSize && Math.abs(pt[i].y-this.CurrentSelectPoint.Figure_point.y)<nSelectRectSize)
							{
								var MoveDistance_x=0,MoveDistance_y=0; 
								var CurrentPointCursor=new CPoint(0,0);
								CurrentPointCursor.x=GetIntValue((this.m_cpCurrentPoint_cursor.x-this.OriginalPoint_Bitmap.x)/this.m_fZoomNum); 
								CurrentPointCursor.y=GetIntValue((this.m_cpCurrentPoint_cursor.y-this.OriginalPoint_Bitmap.y)/this.m_fZoomNum); 
								switch(i)
								{
								case 1: 
									if (CurrentPointCursor.x>=pt[2].x || CurrentPointCursor.y>=pt[4].y )
									{
										break;
									}
									else
									{
										MoveDistance_x=GetIntValue((this.m_cpCurrentPoint_cursor.x-this.OriginalPoint_Bitmap.x)/this.m_fZoomNum)-Iterator.figure_rect.left; 
										MoveDistance_y=GetIntValue((this.m_cpCurrentPoint_cursor.y-this.OriginalPoint_Bitmap.y)/this.m_fZoomNum)-Iterator.figure_rect.top; 
										Iterator.figure_rect.left=GetIntValue((this.m_cpCurrentPoint_cursor.x-this.OriginalPoint_Bitmap.x)/this.m_fZoomNum); 
										Iterator.figure_rect.top=GetIntValue((this.m_cpCurrentPoint_cursor.y-this.OriginalPoint_Bitmap.y)/this.m_fZoomNum); 
										if (Iterator.figure_rect_outside.left+MoveDistance_x<=0 || Iterator.figure_rect_outside.top+MoveDistance_y<=0)
										{
											break;
										}
										else
										{
											Iterator.figure_rect_outside.left+=MoveDistance_x;
											Iterator.figure_rect_outside.top+=MoveDistance_y;
											this.CurrentSelectPoint.Figure_point.x=Iterator.figure_rect.left;
											this.CurrentSelectPoint.Figure_point.y=Iterator.figure_rect.top;
											break;
										}  
									} 
								case 2:
									if (CurrentPointCursor.x<=pt[1].x || CurrentPointCursor.y>=pt[3].y)
									{
										break;
									}
									else
									{
										MoveDistance_x=GetIntValue((this.m_cpCurrentPoint_cursor.x-this.OriginalPoint_Bitmap.x)/this.m_fZoomNum)-Iterator.figure_rect.right; 
										MoveDistance_y=GetIntValue((this.m_cpCurrentPoint_cursor.y-this.OriginalPoint_Bitmap.y)/this.m_fZoomNum)-Iterator.figure_rect.top; 
										Iterator.figure_rect.right=GetIntValue((this.m_cpCurrentPoint_cursor.x-this.OriginalPoint_Bitmap.x)/this.m_fZoomNum); 
										Iterator.figure_rect.top=GetIntValue((this.m_cpCurrentPoint_cursor.y-this.OriginalPoint_Bitmap.y)/this.m_fZoomNum); 
										if (Iterator.figure_rect_outside.right+MoveDistance_x>=this.m_RectFigure.right || Iterator.figure_rect_outside.top+MoveDistance_y<=0)
										{
											break;
										}
										else
										{
											Iterator.figure_rect_outside.right+=MoveDistance_x;
											Iterator.figure_rect_outside.top+=MoveDistance_y;
											this.CurrentSelectPoint.Figure_point.x=Iterator.figure_rect.right;
											this.CurrentSelectPoint.Figure_point.y=Iterator.figure_rect.top;
											break;
										} 

									} 
								case 3:
									if (CurrentPointCursor.x<=pt[4].x || CurrentPointCursor.y<=pt[2].y)
									{
										break;
									}
									else
									{
										MoveDistance_x=GetIntValue((this.m_cpCurrentPoint_cursor.x-this.OriginalPoint_Bitmap.x)/this.m_fZoomNum)-Iterator.figure_rect.right; 
										MoveDistance_y=GetIntValue((this.m_cpCurrentPoint_cursor.y-this.OriginalPoint_Bitmap.y)/this.m_fZoomNum)-Iterator.figure_rect.bottom; 
										Iterator.figure_rect.right=GetIntValue((this.m_cpCurrentPoint_cursor.x-this.OriginalPoint_Bitmap.x)/this.m_fZoomNum); 
										Iterator.figure_rect.bottom=GetIntValue((this.m_cpCurrentPoint_cursor.y-this.OriginalPoint_Bitmap.y)/this.m_fZoomNum); 
										if (Iterator.figure_rect_outside.right+MoveDistance_x>=this.m_RectFigure.right || Iterator.figure_rect_outside.bottom+MoveDistance_y>=this.m_RectFigure.bottom)
										{
											break;
										}
										else
										{
											Iterator.figure_rect_outside.right+=MoveDistance_x;
											Iterator.figure_rect_outside.bottom+=MoveDistance_y;
											this.CurrentSelectPoint.Figure_point.x=Iterator.figure_rect.right;
											this.CurrentSelectPoint.Figure_point.y=Iterator.figure_rect.bottom;
											break;
										} 
									}									
								case 4:
									if (CurrentPointCursor.x>=pt[3].x || CurrentPointCursor.y<=pt[1].y)
									{
										break;
									}
									else
									{
										MoveDistance_x=GetIntValue((this.m_cpCurrentPoint_cursor.x-this.OriginalPoint_Bitmap.x)/this.m_fZoomNum)-Iterator.figure_rect.left; 
										MoveDistance_y=GetIntValue((this.m_cpCurrentPoint_cursor.y-this.OriginalPoint_Bitmap.y)/this.m_fZoomNum)-Iterator.figure_rect.bottom; 
										Iterator.figure_rect.left=GetIntValue((this.m_cpCurrentPoint_cursor.x-this.OriginalPoint_Bitmap.x)/this.m_fZoomNum); 
										Iterator.figure_rect.bottom=GetIntValue((this.m_cpCurrentPoint_cursor.y-this.OriginalPoint_Bitmap.y)/this.m_fZoomNum); 
										if (Iterator.figure_rect_outside.left+MoveDistance_x<=0 || Iterator.figure_rect_outside.bottom+MoveDistance_y>=this.m_RectFigure.bottom)
										{
											break;
										}
										else
										{
											Iterator.figure_rect_outside.left+=MoveDistance_x;
											Iterator.figure_rect_outside.bottom+=MoveDistance_y;
											this.CurrentSelectPoint.Figure_point.x=Iterator.figure_rect.left;
											this.CurrentSelectPoint.Figure_point.y=Iterator.figure_rect.bottom;
											break;
										} 
									}									
								case 5: 									
									if (this.PointInRectEdge(CurrentPointCursor,Iterator.figure_rect,LeftTop))
									{
										if (this.b_ChooseDRectType)
										{
											MoveDistance_x=GetIntValue((this.m_cpCurrentPoint_cursor.x-this.OriginalPoint_Bitmap.x)/this.m_fZoomNum)-Iterator.figure_rect_outside.left; 
											MoveDistance_y=GetIntValue((this.m_cpCurrentPoint_cursor.y-this.OriginalPoint_Bitmap.y)/this.m_fZoomNum)-Iterator.figure_rect_outside.top; 

											if (Iterator.figure_rect_outside.right-MoveDistance_x>=this.m_RectFigure.right || Iterator.figure_rect_outside.bottom-MoveDistance_y>=this.m_RectFigure.bottom)
											{
												break;
											}
											else
											{
												Iterator.figure_rect_outside.left=GetIntValue((this.m_cpCurrentPoint_cursor.x-this.OriginalPoint_Bitmap.x)/this.m_fZoomNum); 
												Iterator.figure_rect_outside.top=GetIntValue((this.m_cpCurrentPoint_cursor.y-this.OriginalPoint_Bitmap.y)/this.m_fZoomNum); 
												//根据纪念币算法修改
												Iterator.figure_rect_outside.right-=MoveDistance_x;
												Iterator.figure_rect_outside.bottom-=MoveDistance_y;
												this.CurrentSelectPoint.Figure_point.x=Iterator.figure_rect_outside.left;
												this.CurrentSelectPoint.Figure_point.y=Iterator.figure_rect_outside.top;
											}		
										}
										else
										{
											Iterator.figure_rect_outside.left=GetIntValue((this.m_cpCurrentPoint_cursor.x-this.OriginalPoint_Bitmap.x)/this.m_fZoomNum); 
											Iterator.figure_rect_outside.top=GetIntValue((this.m_cpCurrentPoint_cursor.y-this.OriginalPoint_Bitmap.y)/this.m_fZoomNum); 
											this.CurrentSelectPoint.Figure_point.x=Iterator.figure_rect_outside.left;
											this.CurrentSelectPoint.Figure_point.y=Iterator.figure_rect_outside.top;
										}

									} 
									break;
								case 6:								
									if (this.PointInRectEdge(CurrentPointCursor,Iterator.figure_rect,RightTop))
									{
										if (this.b_ChooseDRectType)
										{
											MoveDistance_x=GetIntValue((this.m_cpCurrentPoint_cursor.x-this.OriginalPoint_Bitmap.x)/this.m_fZoomNum)-Iterator.figure_rect_outside.right; 
											MoveDistance_y=GetIntValue((this.m_cpCurrentPoint_cursor.y-this.OriginalPoint_Bitmap.y)/this.m_fZoomNum)-Iterator.figure_rect_outside.top; 

											if (Iterator.figure_rect_outside.left-MoveDistance_x<=0 || Iterator.figure_rect_outside.bottom-MoveDistance_y>=this.m_RectFigure.bottom)
											{
												break;
											}
											else
											{
												Iterator.figure_rect_outside.right=GetIntValue((this.m_cpCurrentPoint_cursor.x-this.OriginalPoint_Bitmap.x)/this.m_fZoomNum); 
												Iterator.figure_rect_outside.top=GetIntValue((this.m_cpCurrentPoint_cursor.y-this.OriginalPoint_Bitmap.y)/this.m_fZoomNum); 
												//根据纪念币算法修改
												Iterator.figure_rect_outside.left-=MoveDistance_x;
												Iterator.figure_rect_outside.bottom-=MoveDistance_y; 

												this.CurrentSelectPoint.Figure_point.x=Iterator.figure_rect_outside.right;
												this.CurrentSelectPoint.Figure_point.y=Iterator.figure_rect_outside.top;
											}		
										}
										else
										{
											Iterator.figure_rect_outside.right=GetIntValue((m_cpCurrentPoint_cursor.x-this.OriginalPoint_Bitmap.x)/this.m_fZoomNum); 
											Iterator.figure_rect_outside.top=GetIntValue((m_cpCurrentPoint_cursor.y-this.OriginalPoint_Bitmap.y)/this.m_fZoomNum); 
											this.CurrentSelectPoint.Figure_point.x=Iterator.figure_rect_outside.right;
											this.CurrentSelectPoint.Figure_point.y=Iterator.figure_rect_outside.top;
										}

									} 
									break;
								case 7:								
									if (this.PointInRectEdge(CurrentPointCursor,Iterator.figure_rect,RightBottom))
									{
										if (this.b_ChooseDRectType)
										{
											MoveDistance_x=GetIntValue((this.m_cpCurrentPoint_cursor.x-this.OriginalPoint_Bitmap.x)/this.m_fZoomNum)-Iterator.figure_rect_outside.right; 
											MoveDistance_y=GetIntValue((this.m_cpCurrentPoint_cursor.y-this.OriginalPoint_Bitmap.y)/this.m_fZoomNum)-Iterator.figure_rect_outside.bottom; 

											if (Iterator.figure_rect_outside.left-MoveDistance_x<=0 || Iterator.figure_rect_outside.top-MoveDistance_y<=0)
											{
												break;
											}
											else
											{
												Iterator.figure_rect_outside.right=GetIntValue((this.m_cpCurrentPoint_cursor.x-this.OriginalPoint_Bitmap.x)/this.m_fZoomNum); 
												Iterator.figure_rect_outside.bottom=GetIntValue((this.m_cpCurrentPoint_cursor.y-this.OriginalPoint_Bitmap.y)/this.m_fZoomNum); 

												//根据纪念币算法修改
												Iterator.figure_rect_outside.left-=MoveDistance_x;
												Iterator.figure_rect_outside.top-=MoveDistance_y;

												this.CurrentSelectPoint.Figure_point.x=Iterator.figure_rect_outside.right;
												this.CurrentSelectPoint.Figure_point.y=Iterator.figure_rect_outside.bottom;
											}
										}
										else
										{
											Iterator.figure_rect_outside.right=GetIntValue((this.m_cpCurrentPoint_cursor.x-this.OriginalPoint_Bitmap.x)/this.m_fZoomNum); 
											Iterator.figure_rect_outside.bottom=GetIntValue((this.m_cpCurrentPoint_cursor.y-this.OriginalPoint_Bitmap.y)/this.m_fZoomNum); 
											this.CurrentSelectPoint.Figure_point.x=Iterator.figure_rect_outside.right;
											this.CurrentSelectPoint.Figure_point.y=Iterator.figure_rect_outside.bottom;
										}


									} 
									break;
								case 8:									
									if (this.PointInRectEdge(CurrentPointCursor,Iterator.figure_rect,LeftBottom))
									{
										if (this.b_ChooseDRectType)
										{
											MoveDistance_x=GetIntValue((this.m_cpCurrentPoint_cursor.x-this.OriginalPoint_Bitmap.x)/m_fZoomNum)-Iterator.figure_rect_outside.left; 
											MoveDistance_y=GetIntValue((this.m_cpCurrentPoint_cursor.y-this.OriginalPoint_Bitmap.y)/m_fZoomNum)-Iterator.figure_rect_outside.bottom; 

											if (Iterator.figure_rect_outside.right-MoveDistance_x>=m_RectFigure.right || Iterator.figure_rect_outside.top-MoveDistance_y<=0)
											{
												break;
											}
											else
											{
												Iterator.figure_rect_outside.left=GetIntValue((this.m_cpCurrentPoint_cursor.x-this.OriginalPoint_Bitmap.x)/this.m_fZoomNum); 
												Iterator.figure_rect_outside.bottom=GetIntValue((this.m_cpCurrentPoint_cursor.y-this.OriginalPoint_Bitmap.y)/this.m_fZoomNum); 

												//根据纪念币算法修改
												Iterator.figure_rect_outside.right-=MoveDistance_x;
												Iterator.figure_rect_outside.top-=MoveDistance_y; 

												this.CurrentSelectPoint.Figure_point.x=Iterator.figure_rect_outside.left;
												this.CurrentSelectPoint.Figure_point.y=Iterator.figure_rect_outside.bottom;
											}
										}
										else
										{
											Iterator.figure_rect_outside.left=GetIntValue((this.m_cpCurrentPoint_cursor.x-this.OriginalPoint_Bitmap.x)/this.m_fZoomNum); 
											Iterator.figure_rect_outside.bottom=GetIntValue((this.m_cpCurrentPoint_cursor.y-this.OriginalPoint_Bitmap.y)/this.m_fZoomNum); 
											this.CurrentSelectPoint.Figure_point.x=Iterator.figure_rect_outside.left;
											this.CurrentSelectPoint.Figure_point.y=Iterator.figure_rect_outside.bottom;
										}


									} 
									break;
								default:
									break;
								}
								b_find=1;
								break;
							}
						}
					}

				}
				if (b_find==1)
				{			
					break;
				}
			}
			bInvalidate++;
		}

		//平移所有图形
		if (this.b_SubFiguresMove && this.b_FigurePointSelect==false && this.b_LeftButtonDown==true )
		{			
			var FindIterator=new Figure;
			var FindIndex=0;			
			for(FindIndex;FindIndex<this.m_FiguresSet.m_nFigureCount;FindIndex++)
			{  
				FindIterator=this.m_FiguresSet.m_Figures[FindIndex];
				if ((FindIterator.figure_id==this.m_nCursorInFigureId && this.m_SelectSubFigureRectIdSet.m_nFigureRectCount>0)
					|| this.b_MoveAllFigures)
				{   
					FindIterator.MoveFigure(this.m_cpDistancePoint.x,this.m_cpDistancePoint.y);
					var b_OutSide=false;
					if (FindIterator.figure_type==DrectType)
					{
						var p1=new CPoint(0,0);
						var p2=new CPoint(0,0); 
						p1.x=GetIntValue(FindIterator.figure_rect_outside.left*this.m_fZoomNum)+this.OriginalPoint_Bitmap.x+FindIterator.shift_x;
						p1.y=GetIntValue(FindIterator.figure_rect_outside.top*this.m_fZoomNum)+this.OriginalPoint_Bitmap.y+FindIterator.shift_y;
						p2.x=GetIntValue(FindIterator.figure_rect_outside.right*this.m_fZoomNum)+this.OriginalPoint_Bitmap.x+FindIterator.shift_x; 
						p2.y=GetIntValue(FindIterator.figure_rect_outside.bottom*this.m_fZoomNum)+this.OriginalPoint_Bitmap.y+FindIterator.shift_y;
						if (this.PointGoOutSide(p1)  || this.PointGoOutSide(p2))
						{
							b_OutSide=true;
						}
						if (b_OutSide)
						{
							FindIterator.MoveFigure(-1*this.m_cpDistancePoint.x,-1*this.m_cpDistancePoint.y);
						}
					  }
					else if(FindIterator.figure_type==CircleType)
					{
						var p1=new CPoint(0,0);
						var p2=new CPoint(0,0); 
						p1.x=GetIntValue(FindIterator.figure_rect.left*this.m_fZoomNum)+this.OriginalPoint_Bitmap.x+FindIterator.shift_x;
						p1.y=GetIntValue(FindIterator.figure_rect.top*this.m_fZoomNum)+this.OriginalPoint_Bitmap.y+FindIterator.shift_y;
						p2.x=GetIntValue(FindIterator.figure_rect.right*this.m_fZoomNum)+this.OriginalPoint_Bitmap.x+FindIterator.shift_x; 
						p2.y=GetIntValue(FindIterator.figure_rect.bottom*this.m_fZoomNum)+this.OriginalPoint_Bitmap.y+FindIterator.shift_y;
						if (this.PointGoOutSide(p1)  || this.PointGoOutSide(p2))
						{
							b_OutSide=true;
						}
						if (b_OutSide)
						{
							FindIterator.MoveFigure(-1*this.m_cpDistancePoint.x,-1*this.m_cpDistancePoint.y);
						} 
					}
					else  //其它的为点组成的图形
					{  
						var PointIterator=new CPoint(0,0);
						var nPointIndex=0;
						var nFindPointIndex=0;
						for (nFindPointIndex;nFindPointIndex<FindIterator.figure_data.nCPointCount;nFindPointIndex++)
						{
							PointIterator=FindIterator.figure_data.m_CPoint[nFindPointIndex];
							var TempPoint=new CPoint(0,0);
							TempPoint.x=GetIntValue(PointIterator.x*this.m_fZoomNum)+this.OriginalPoint_Bitmap.x+FindIterator.shift_x;
							TempPoint.y=GetIntValue(PointIterator.y*this.m_fZoomNum)+this.OriginalPoint_Bitmap.y+FindIterator.shift_y;
							if(this.PointGoOutSide((TempPoint)))
							{
								b_OutSide=true;
								break;
							}	
							nPointIndex++;						
						}
						if (b_OutSide)
						{
							FindIterator.MoveFigure(-1*this.m_cpDistancePoint.x,-1*this.m_cpDistancePoint.y);
						}
					} 
				}				
			}
			bInvalidate++;
		}  
		else if(this.b_SubFiguresMove==false && this.b_FigurePointSelect==false && this.b_LeftButtonDown==true &&  this.b_DrawPoly==false)
		{ 
			this.OriginalPoint_Bitmap.x=this.m_cpDistancePoint.x+this.OriginalPoint_Bitmap.x;
			this.OriginalPoint_Bitmap.y=this.m_cpDistancePoint.y+this.OriginalPoint_Bitmap.y;  
			bInvalidate++;		
		} 
	}     
	
	if(this.b_DrawRect || this.b_DrawPoly || this.b_DrawCircle|| this.b_LeftButtonDown || this.b_DrawDoubleRect)
	{		
		bInvalidate++;
	}
	
	PointEqual(this.m_cpOriginalPoint_cursor,this.m_cpCurrentPoint_cursor);		
	
	if (bInvalidate>0)
	{
		this.RepaintControl();
	}
}

function LButtonDown(point)			 //左键压下
{
	point.x-=this.x_Distance;
	point.y-=this.y_Distance; 
	if (!PointInCurrentRect(this.m_ClientRect,point))
	{
		return;
	}   	

	this.b_LeftButtonDown=true;
	PointEqual(this.m_cpOriginalPoint_cursor,point);
	PointEqual(this.m_cpLastClickPoint,point);
	if(this.b_DrawRect==false 	&& this.b_DrawDoubleRect==false 	&& this.b_DrawCircle==false)
	{
		//功能: 判断当前点有在哪个区域的点区域中
		//清空上次左键选中区域集合
		var nLastSelectFigure=this.m_nCursorInFigureId;
		this.m_SelectSubFigureRectIdSet.ClearFigureRectData();
		this.m_nCursorInFigureId=0; 
		//判断当前点选中了哪些区域
		var maxId=this.SelectSubFigureRectSet(this.m_cpOriginalPoint_cursor);  
		if (this.m_SelectSubFigureRectIdSet.m_nFigureRectCount>0 && this.b_LButtonDouC==false ) 
		{
			this.m_nCursorInFigureId=maxId; 			
		}   	
		else
			this.m_nCursorInFigureId=0;


		if (this.m_nCursorInFigureId!=0 && this.b_ChangeFigureSize)
		{ 
			this.SearchPoint();
		} 

		this.RepaintControl();
	}

	if(this.b_DrawPoly==true)
	{
		//对多边形的处理	 
		if (this.b_LButtonDouC==false )  //第一次点击，开始画图形
		{
			//给控件图形赋值，初始化
			this.b_LButtonDouC=true; 
			this.m_TempLinesPointSet.AddCPoint(point);   //实时画时显示
			//将显示坐标转成真实坐标
			point.x-=this.OriginalPoint_Bitmap.x;
			point.y-=this.OriginalPoint_Bitmap.y;
			point.x=GetIntValue(point.x/this.m_fZoomNum);
			point.y=GetIntValue(point.y/this.m_fZoomNum);
			this.CurrentFigure.figure_data.AddCPoint((point));  //存入到列表中  
		}
		else
		{ 
			if (!this.PointGoOutSide(point))
			{
				if (this.b_LButtonDouC==true && this.b_DrawPoly==true)
				{	 
					if(this.m_TempLinesPointSet.nCPointCount<this.m_PolyPointCount)
					{
						this.m_TempLinesPointSet.AddCPoint(point);   //画实时线条 
						//将显示坐标转成真实坐标
						point.x-=this.OriginalPoint_Bitmap.x;
						point.y-=this.OriginalPoint_Bitmap.y;
						point.x=GetIntValue(point.x/this.m_fZoomNum);
						point.y=GetIntValue(point.y/this.m_fZoomNum);
						this.CurrentFigure.figure_data.AddCPoint((point));  //  存入到图像			
						this.RepaintControl();
					}
					else
					{
						this.FinishDrawPolyFigure();
					}
					
				} 
			}  		
		}
	}

	

	if (this.b_DrawRect || this.b_DrawDoubleRect || this.b_DrawCircle)
	{ 
		if (!this.PointGoOutSide(point))
		{
			//如果开始绘画方框
			if (this.b_DrawRect )
			{ 
				//如果开始绘画方框，点击了一个左键
				if (this.b_PreDrawRect==false)
				{ 
					this.b_PreDrawRect=true;	 
					//每次只有一个图形在绘制
					point.x-=this.OriginalPoint_Bitmap.x;
					point.y-=this.OriginalPoint_Bitmap.y;
					point.x=GetIntValue(point.x/this.m_fZoomNum);
					point.y=GetIntValue(point.y/this.m_fZoomNum);
					this.CurrentFigure.figure_data.AddCPoint((point));  //  存入到图像  
					//console.log(point.x,point.y); 
				}
			}
			else
				this.b_PreDrawRect=false; 

				
			//如果开始绘画双方框
			if (this.b_DrawDoubleRect )
			{ 
				//如果开始绘画双方框，点击了一个左键
				if (this.b_PreDrawDoubleRect==false)				
				{
					this.b_PreDrawDoubleRect=true;

					//每次只有一个图形在绘制
					point.x-=this.OriginalPoint_Bitmap.x;
					point.y-=this.OriginalPoint_Bitmap.y;
					point.x=GetIntValue(point.x/this.m_fZoomNum);
					point.y=GetIntValue(point.y/this.m_fZoomNum);
					//  存入到图像
					this.CurrentFigure.figure_rect.left=point.x;
					this.CurrentFigure.figure_rect.top=point.y;
					this.CurrentFigure.figure_rect_outside.left=point.x-GetIntValue(FigureControl_DoubleRectDistance/this.m_fZoomNum);
					this.CurrentFigure.figure_rect_outside.top=point.y-GetIntValue(FigureControl_DoubleRectDistance/this.m_fZoomNum); 
				}
			}
			else
			{
				this.b_PreDrawDoubleRect=false;
			} 

			//开始绘制圆
			if(this.b_DrawCircle)
			{ 
				if (this.b_PreDrawCircle==false)
				{ 
					this.b_PreDrawCircle=true;
					point.x-=this.OriginalPoint_Bitmap.x;
					point.y-=this.OriginalPoint_Bitmap.y;
					point.x=GetIntValue(point.x/this.m_fZoomNum);
					point.y=GetIntValue(point.y/this.m_fZoomNum);
					//  存入
					this.CurrentFigure.figure_rect.left=point.x;
					this.CurrentFigure.figure_rect.top=point.y; 
				}
			}
			else
				this.b_PreDrawCircle=false;
		}
		this.RepaintControl();
		return;
	}
}


function RButtonDown(point)
{	
	this.LButtonDown(point);
	this.FinishDrawPolyFigure();

	if( this.m_nCursorInFigureId>=1)
	{
		if(this.bFitFigureSize)
			this.BackToInitFigure();
		else
			this.FitFigureSize(this.m_nCursorInFigureId);
	}	
}

function LButtonUp( point)			//左键弹上
{
	point.x-=this.x_Distance;
	point.y-=this.y_Distance; 
	if (!PointInCurrentRect(this.m_ClientRect,point))
	{
		return;
	}    		

	this.b_LeftButtonDown=false;

	if (this.b_DrawRect || this.b_DrawDoubleRect || this.b_DrawCircle)
	{ 
		if (!this.PointGoOutSide(point))
		{
			//如果开始绘画方框
			if (this.b_DrawRect )
			{ 
				//如果开始绘画方框，点击了一个左键
				if (this.b_PreDrawRect)
				{
					this.b_PreDrawRect=false;
					//方框剩下的三个点
					point.x-=this.OriginalPoint_Bitmap.x;
					point.y-=this.OriginalPoint_Bitmap.y;
					point.x=GetIntValue(point.x/this.m_fZoomNum);
					point.y=GetIntValue(point.y/this.m_fZoomNum);


					var FindIterator=new CPoint(0,0);
					var FindPointIndex=0;
					FindIterator=this.CurrentFigure.figure_data.m_CPoint[FindPointIndex];
					if(FindIterator.x > point.x)
					{
						var nTemp = FindIterator.x;
						FindIterator.x = point.x;
						point.x = nTemp;
					}
					if(FindIterator.y > point.y)
					{
						var nTemp = FindIterator.y;
						FindIterator.y = point.y;
						point.y = nTemp;
					}
					var p1=new CPoint(0,0);
					var p2=new CPoint(0,0);
					var p4=new CPoint(0,0);
					p1.x=FindIterator.x;
					p1.y=FindIterator.y;
					p2.x=point.x;
					p2.y=p1.y;
					p4.x=p1.x;
					p4.y=point.y;

					//其余三个点存入到图像
					this.CurrentFigure.figure_data.AddCPoint((p2));
					this.CurrentFigure.figure_data.AddCPoint((point));  
					this.CurrentFigure.figure_data.AddCPoint((p4));

					this.CurrentFigure.figure_rect.left=p1.x;
					this.CurrentFigure.figure_rect.top=p1.y;
					this.CurrentFigure.figure_rect.right=point.x;
					this.CurrentFigure.figure_rect.bottom=point.y;

					this.CurrentFigure.figure_color=this.m_FigureColor;
					
					this.CurrentFigure.figure_name=this.m_csCurrentDrawFigureName; 
					this.m_csCurrentDrawFigureName="";
					this.CurrentFigure.figure_id=++this.m_nFigureCount;
					this.CurrentFigure.figure_type=RectType;
					this.CurrentFigure.ReserverData=this.m_strDataReserved;

					this.m_FiguresSet.AddFigure(this.CurrentFigure);
					this.AddFigureHis(this.m_FiguresSet);
					this.CurrentFigure.ClearFigureData(); 					
					this.m_TempLinesPointSet.ClearData();
				}
				else
				{ 
					this.b_PreDrawRect=true;	 
					//每次只有一个图形在绘制
					point.x-=this.OriginalPoint_Bitmap.x;
					point.y-=this.OriginalPoint_Bitmap.y;
					point.x=GetIntValue(point.x/this.m_fZoomNum);
					point.y=GetIntValue(point.y/this.m_fZoomNum);
					this.CurrentFigure.figure_data.AddCPoint((point));  //  存入到图像   
				}
			}
			else
				this.b_PreDrawRect=false; 

				
			//如果开始绘画双方框
			if (this.b_DrawDoubleRect )
			{ 
				//如果开始绘画双方框，点击了一个左键
				if (this.b_PreDrawDoubleRect)
				{
					this.b_PreDrawDoubleRect=false;
					//方框剩下的三个点
					point.x-=this.OriginalPoint_Bitmap.x;
					point.y-=this.OriginalPoint_Bitmap.y;
					point.x=GetIntValue(point.x/this.m_fZoomNum);
					point.y=GetIntValue(point.y/this.m_fZoomNum); 
					this.CurrentFigure.figure_rect.right=point.x;
					this.CurrentFigure.figure_rect.bottom=point.y; 
					this.CurrentFigure.figure_rect_outside.right=point.x+GetIntValue(FigureControl_DoubleRectDistance/this.m_fZoomNum);
					this.CurrentFigure.figure_rect_outside.bottom=point.y+GetIntValue(FigureControl_DoubleRectDistance/this.m_fZoomNum); 
					//不允许画不规范的双方框
					if ((this.CurrentFigure.figure_rect.right<=this.CurrentFigure.figure_rect.left) 
					|| (this.CurrentFigure.figure_rect.top>=this.CurrentFigure.figure_rect.bottom))
					{
						this.CurrentFigure.ClearFigureData();
					}
					else
					{
						this.CurrentFigure.figure_color=this.m_FigureColor;					
						this.CurrentFigure.figure_id=++this.m_nFigureCount;
						this.CurrentFigure.figure_name=this.m_csCurrentDrawFigureName;	
						this.m_csCurrentDrawFigureName="";
						this.CurrentFigure.figure_type=DrectType;						
						this.CurrentFigure.ReserverData=this.m_strDataReserved;

						//存入
						this.m_FiguresSet.AddFigure(this.CurrentFigure);  
						this.AddFigureHis(this.m_FiguresSet);						
						this.CurrentFigure.ClearFigureData();
						this.m_TempLinesPointSet.ClearData();
		
					}

				}
				else
				{
					this.b_PreDrawDoubleRect=true;

					//每次只有一个图形在绘制
					point.x-=this.OriginalPoint_Bitmap.x;
					point.y-=this.OriginalPoint_Bitmap.y;
					point.x=GetIntValue(point.x/this.m_fZoomNum);
					point.y=GetIntValue(point.y/this.m_fZoomNum);
					//  存入到图像
					this.CurrentFigure.figure_rect.left=point.x;
					this.CurrentFigure.figure_rect.top=point.y;
					this.CurrentFigure.figure_rect_outside.left=point.x-GetIntValue(FigureControl_DoubleRectDistance/this.m_fZoomNum);
					this.CurrentFigure.figure_rect_outside.top=point.y-GetIntValue(FigureControl_DoubleRectDistance/this.m_fZoomNum); 
				}
			}
			else
			{
				this.b_PreDrawDoubleRect=false;
			} 

			//开始绘制圆
			if(this.b_DrawCircle)
			{ 
				if (this.b_PreDrawCircle)
				{
					this.b_PreDrawCircle=false;
					point.x-=this.OriginalPoint_Bitmap.x;
					point.y-=this.OriginalPoint_Bitmap.y;
					point.x=GetIntValue(point.x/this.m_fZoomNum);
					point.y=GetIntValue(point.y/this.m_fZoomNum);

					this.CurrentFigure.figure_rect.right=point.x;
					this.CurrentFigure.figure_rect.bottom=point.y;
					this.CurrentFigure.figure_color=this.m_FigureColor; 
					
					this.CurrentFigure.figure_name=this.m_csCurrentDrawFigureName;
					this.m_csCurrentDrawFigureName="";
					this.CurrentFigure.figure_id=++this.m_nFigureCount;
					this.CurrentFigure.figure_type=CircleType;
					this.CurrentFigure.ReserverData=this.m_strDataReserved;
					
					this.m_FiguresSet.AddFigure(this.CurrentFigure); 
					this.AddFigureHis(this.m_FiguresSet);
					
					this.CurrentFigure.ClearFigureData();
					this.m_TempLinesPointSet.ClearData();
				}
				else
				{ 
					this.b_PreDrawCircle=true;
					point.x-=this.OriginalPoint_Bitmap.x;
					point.y-=this.OriginalPoint_Bitmap.y;
					point.x=GetIntValue(point.x/this.m_fZoomNum);
					point.y=GetIntValue(point.y/this.m_fZoomNum);
					//  存入
					this.CurrentFigure.figure_rect.left=point.x;
					this.CurrentFigure.figure_rect.top=point.y; 
				}
			}
			else
				this.b_PreDrawCircle=false;
		}
		this.RepaintControl();		
		return;
	}
	
	//停止移动图形，将平移距离计算进原来坐标
	if (this.b_SubFiguresMove)
	{ 
		//list<Figure>::iterator FindIterator; 
		var FindIterator=new Figure;
		var FindIndex=0;
		FindIterator=this.m_FiguresSet.m_Figures[FindIndex];
		
		for(FindIndex;FindIndex<this.m_FiguresSet.m_nFigureCount;FindIndex++)
		{			
		
			FindIterator=this.m_FiguresSet.m_Figures[FindIndex];
		
			if ((FindIterator.figure_id==this.m_nCursorInFigureId )
				&& this.m_SelectSubFigureRectIdSet.m_nFigureRectCount>0 && this.b_FigurePointSelect==false)						
			{  
				FindIterator.MoveFigure(this.m_cpDistancePoint.x,this.m_cpDistancePoint.y); // (m_cpDistancePoint.x>2 ||m_cpDistancePoint.y>2))//防止轻微的移动  
				
				if (FindIterator.figure_type==DrectType)
				{
					FindIterator.DistanceToData(this.m_fZoomNum,DrectType);
				}
				else if (FindIterator.figure_type==CircleType)
				{
					FindIterator.DistanceToData(this.m_fZoomNum,CircleType);
				}
				else if (FindIterator.figure_type==RectType)
				{
					FindIterator.DistanceToData (this.m_fZoomNum,RectType);
				}
				else
				{
					FindIterator.DistanceToData(this.m_fZoomNum,PolyType);
				} 
				
				this.AddFigureHis(this.m_FiguresSet);

				this.m_cpDistancePoint.x=0;
				this.m_cpDistancePoint.y=0;
			}				
		}
	}   
	//不在选择图形边缘点
	if(	this.b_FigurePointSelect==true)
	{
		this.b_FigurePointSelect=false;  
		this.AddFigureHis(this.m_FiguresSet);		
	}
	
}
	
function LButtonDblClk(point)			//左键双击
{
	point.x-=this.x_Distance;
	point.y-=this.y_Distance; 
	var tempPoint=new CPoint(0,0);
	tempPoint.x=GetIntValue((point.x-this.OriginalPoint_Bitmap.x)/this.m_fZoomNum);
	tempPoint.y=GetIntValue((point.y-this.OriginalPoint_Bitmap.y)/this.m_fZoomNum); 
	if (!PointInCurrentRect(this.m_RectFigure,tempPoint))
	{
		return;
	}   
//删除多边形边缘点
	//list<Figure>::iterator Iterator;
	var Iterator=new Figure;
	var IfFind=false;
	for(var FindIndex=0;FindIndex<this.m_FiguresSet.m_nFigureCount;FindIndex++)
	{
		Iterator=this.m_FiguresSet.m_Figures[FindIndex];
		if (Iterator.figure_type==PolyType
			&& Iterator.figure_data.MaxPointCount==FigureControl_MaxPointCount)
		{					
			for (var pointIndex=0;pointIndex<Iterator.figure_data.nCPointCount;pointIndex++)
			{
				var PointIterator=new CPoint(0,0);
				PointIterator.x=Iterator.figure_data.m_CPoint[pointIndex].x;
				PointIterator.y=Iterator.figure_data.m_CPoint[pointIndex].y;
				var pt=new CPoint(0,0);
				pt.x=GetIntValue(PointIterator.x*this.m_fZoomNum)+this.OriginalPoint_Bitmap.x+Iterator.shift_x;
				pt.y=GetIntValue(PointIterator.y*this.m_fZoomNum)+this.OriginalPoint_Bitmap.y+Iterator.shift_y;

				//console.log(pointIndex,pt.x,pt.y,this.m_cpOriginalPoint_cursor.x,this.m_cpOriginalPoint_cursor.y);
				if (PointInPointRect(this.m_cpOriginalPoint_cursor,pt))
				{ 
					//删除一个边缘点
					if (pointIndex%2==0)
					{
						Iterator.figure_data.eraseCPoint(pointIndex);	
					} 
					else//添加一个边缘点
					{
						Iterator.figure_data.InsertPoint(pointIndex);						
					} 
					IfFind=true;
					this.AddFigureHis(this.m_FiguresSet);
					this.RepaintControl();
					break;
				}
			}
		}
		if (IfFind==true)
		{
			break;
		} 
	}	
}


