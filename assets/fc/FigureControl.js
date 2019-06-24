
document.write("<script type='text/javascript' src='ComFuns.js'></script>");
document.write("<script type='text/javascript' src='FCElements.js'></script>");
document.write("<script type='text/javascript' src='FCOperations.js'></script>");
document.write("<script type='text/javascript' src='FCAtrributes.js'></script>");
document.write("<script type='text/javascript' src='FCFun.js'></script>");
//defines
//LoadBmpType
var BmpFileType=0,BufferType=1;
// figureTypes
var LineType=0,PolyType=1,RectType=2,DrectType=3,CircleType=4;
//Color Types
var NormalColor='#ffffff',GreenColor="#00ff00",RedColor='#ff0000',YelloColor='#ffff00';
var FigureControl_MaxPointCount=50;
var FigureControl_MaxFigureCount=50;
var FigureControl_ReservedLen=100;

var  FigureControl_ScaleBot=0.8;			//缩放系数
var  FigureControl_FitZoomRate =0.05;
var  FigureControl_Radius =3;			    //原点半径
var  FigureControl_ShowPointRadius = 2;      //显示原点半径
var  FigureControl_TextLength =175	;		//图形名称显示长度
var  FigureControl_DoubleRectDistance =15 ; //双方框间距
var  FigureControl_PointRectDistance= 6  ; //小方框大小
var  FigureControl_CrossSize= 10	;		//标记点大小 
var  FigureControl_MaxSelectFigureNum= 10 ; 
var  FigureControl_UserMessageMenu =10000;
var  FigureControl_MaxZoomScale=  -80;
var  FigureControl_ReservedLen	=256;
var  FigureControl_MaxZoomRate =8;
var  FigureControl_MinZoorRate=0.03;
var  FigureControl_HisCount=10;
//figurecontrol ---------------------------------------------
function FigureControl(canvas)
{
	document.oncontextmenu = function(e){
		return false;
	}
	this.m_Canvas=document.getElementById(canvas);
	this.m_Context=document.getElementById(canvas).getContext('2d');
	//attributes
	this.m_fZoomNum=0;	//图像缩放倍速   		
	this.m_MovePoint_cursor=new CPoint(0,0);   //当前鼠标移动的位置
	this.m_cpCurrentPoint_cursor=new CPoint(0,0); //当前鼠标位置
	this.m_cpOriginalPoint_cursor=new CPoint(0,0);  //上次鼠标位置
	this.OriginalPoint_Bitmap=new CPoint(0,0);  //当前图像原点坐标 
	this.m_cpLastClickPoint=new CPoint(0,0);
	this.m_ImageHeight=0;
	this.m_ImageWeith=0;  //用来显示图像长、宽 
	this.m_OldImageWeith=0;
	this.m_OldImageHeight=0;
	this.m_CurrentDistance=new CPoint(0,0);  //缩放后，所有点x,y轴的偏移 		
	this.m_FigureColor=NormalColor;  //图形颜色
	this.m_InitBackGroundColor=NormalColor;
	this.m_OutsideLineColor=NormalColor;
	this.m_nControlWidth=0;
	this.m_nControlHeight=0; //控件宽度、高度 
	this.m_nScrollRate=0; //滚动次数  		
	this.m_csCurrentDrawFigureName=null;
	this.m_nFigureCount=0;
	this.FigureHisIndex=0;
	
	this.CurrentSelectPoint=new PointLable(0,new CPoint(0,0),0); //当前选中的图形边缘点 
	this.m_RectFigure=new CRect(0,0,0,0);  //图像区域
	this.m_ClientRect=new CRect(0,0,0,0);	//控件区域大小
	this.m_PositionLabel=new CPoint(0,0); //标记点位置
	this.m_cpDistancePoint=new CPoint(0,0);	//鼠标移动位置	



	this.m_Image=new Image;	
	
	this.m_FiguresSetHis=new Array(FigureControl_HisCount);
	for(var Index=0;Index<FigureControl_HisCount;Index++)
		this.m_FiguresSetHis[Index]=new FiguresSet;

		
	this.CurrentFigure=new Figure();  //当前图形 
	this.m_FiguresSet=new FiguresSet;
	this.m_TempLinesPointSet=new figure_data;
	this.m_SelectSubFigureRectIdSet=new FiguresIDSet;
	this.ForbiddenMoveFigureIdSet=new Array(FigureControl_MaxFigureCount);
	this.ForbiddenDragFigureIdSet=new Array(FigureControl_MaxFigureCount);
	
	//Variables
	this.b_SubFiguresMove;//图形是否移动
	this.b_SubFiguresZoom;  //图形是否缩放 
	this.b_LButtonDouC;  //是否开始新图形  
	this.b_DrawCircle;  //画圈
	this.b_DrawDoubleRect; //画双方框
	this.b_DrawPoly;   //多边形
	this.b_DrawRect;  //方框
	this.b_PreDrawRect; //左键是否准备好绘画方框
	this.b_PreDrawDoubleRect; //左键是否准备好绘画双方框
	this.b_PreDrawCircle; //左键是否准备好绘画圆 
	this.b_FigurePointSelect; //图形中边缘点选中 
	this.b_ChangeFigureValue; //更改图像像素值		
	this.b_ProcessImageFromDc;  //是否处理外部绘制要求
	this.b_CursorInOutSide;  //鼠标是否在图像外	
	this.b_InitShiftToCenter;  //控件初始是否移动到控件中间 
	this.b_LoadData;  //数据初始化
	this.b_ShowPositionLabel;  //是否显示十字标记
	this.b_LeftButtonDown;  //左键是否按下
	this.b_ShowPointRect; //是否显示边角小方框
	this.b_ChangeFigureSize;   //是否允许改动图形大小
	this.b_ChooseDRectType=false;
	this.b_ShowOutSideLine=false;
	this.b_MoveAllFigures=false;
	this.b_BShowBackGround=false;
	this.m_nCursorInFigureId=0;   //鼠标左键所在的区域id　
	this.SelectFigureId=0;  //设置选中图形id
	this.x_Distance=0;
	this.y_Distance=0;  //与主界面的坐标偏移	
	this.m_nNextFigureIndex=0;		
	this.m_strDataReserved;	
	this.m_bMouseClickFlag=false;
	this.bFitFigureSize=false;
	this.m_PolyPointCount=FigureControl_MaxPointCount;
	
	
	//函数
	//internal Use Functions
	this.InitFigureControl=InitFigureControl;  //初始化控件参数 
	this.RepaintControl=RepaintControl;//控件重绘  CPaintDC*
	this.ConnectLine=ConnectLine; //有线组成的图形形连线
	this.DrawFigure=DrawFigure;//绘制图形
	this.FillFigureRect=FillFigureRect; //填充图形 
	this.drawTempLines=drawTempLines;  //实时显示正在画的线条
	this.DrawOutSideLine=DrawOutSideLine; //图像外围框 
	this.InSubFigureRect=InSubFigureRect;//点是否在直接指定范围内
	this.InEllipseRect=InEllipseRect;//点是否在圆区域内
	this.DrawRect=DrawRect;//绘方框区域
	this.DrawEllipseRect=DrawEllipseRect;//绘圆
	this.DrawDoubleRect=DrawDoubleRect;//绘双方框
	this.SelectSubFigureRectSet=SelectSubFigureRectSet;//确定当前点所在的区域范围集合
	this.DrawPointRect=DrawPointRect; //绘点方框
	this.PointGoOutSide=PointGoOutSide;  //当前点是否已经超出图片移动范围
	this.PointInPointRect=PointInPointRect;  //A点是否在B点区域范围内
	this.PointInRectEdge=PointInRectEdge;
	this.PointInRect=PointInRect; //点是否在方框区域内
	this.SearchPoint=SearchPoint;				//在图形集里面寻找当前鼠标点的近邻 
	this.SetFillStyle=SetFillStyle;//设置填充风格
	this.GetFillStyle=GetFillStyle;		//获取填充风格；
	this.ShowOtherFigures=ShowOtherFigures;  //显示剩余的一些图形形
	this.setInitZoomScale=setInitZoomScale;	// 初始缩放比率，放大的，为负数
	this.ShiftImageToCenter=ShiftImageToCenter;  //初始图像居中 
	this.FinishDrawPolyFigure=FinishDrawPolyFigure;
	this.BackHis=BackHis;
	this.ForwHis=ForwHis;
	this.AddFigureHis=AddFigureHis;
	this.FitFigureSize=FitFigureSize;
	
		
	// External User Event Operations
	//外部消息响应 ，需要从外部传入给控件
	this.MouseWheel=MouseWheel;  //滚动鼠标中建
	this.MouseMove=MouseMove;			 //移动鼠标
	this.LButtonDown=LButtonDown;			 //左键压下
	this.LButtonUp=LButtonUp;		//左键弹上
	this.LButtonDblClk=LButtonDblClk;			//左键双击
	this.RButtonDown=RButtonDown;
	
	
	//public:	//功能函数 
	//回到初始位置 
	this.BackToInitFigure=BackToInitFigure;
	//清除当前绘制状态
	this.ClearDrawStatus=ClearDrawStatus;	
	//删除所有图形
	this.ClearAllFigures=ClearAllFigures;			
	//取消填充图形
	this.CancelFillFigure=CancelFillFigure;
	//复制指定图形
	this.CopyCurrentSelectFigureRect=CopyCurrentSelectFigureRect;		
	//删除指定类型的图形
	this.DeleteFigureType=DeleteFigureType;
	//删除最后一个图形
	this.DeleteLastFigure=DeleteLastFigure;		
	//删除指定图形
	this.DeleteSelectFigure=DeleteSelectFigure;				
	//删除指定的图形区域，不包括双方框
	this.DeleteFigureByName=DeleteFigureByName;
	//填充图形
	this.CancelFillFigure=CancelFillFigure;
	this.FillFigure=FillFigure;
	//是否选中边缘点
	this.BSelectFigurePoint=BSelectFigurePoint;
	//双方框对角位置是否同时拖动
	this.SetDRectChooseType=SetDRectChooseType;
	//图形形是否能够移动
	this.SetFigureMoveStatus=SetFigureMoveStatus;	
	//显示边小方框
	this.ShowPointRect=ShowPointRect;			
	//是否允许改变图形大小
	this.ChangeFigureSize=ChangeFigureSize;		
	
	/************************************************************************/
	/* 
	该组函数用来在控件中手动绘制图形
	csFigureName	图形名字
	strReservedData 保留字段
	*/
	/************************************************************************/
	this.DrawRectFigure=DrawRectFigure;//绘制方框
	this.DrawDoubleRectFigure=DrawDoubleRectFigure;	//绘制双方框
	this.DrawPolyFigure=DrawPolyFigure;			//绘制多边形
	this.DrawCircleFigure=DrawCircleFigure	;		//绘制圆形 
				
	
	//获取指定图形信息，返回一个指针可以修改Figure信息
	this.GetFigure=GetFigure;
	//获取控件内数据
	this.GetFigureData=GetFigureData;
	this.GetFigureCount=GetFigureCount;
	
	//获得给定图形类型
	this.GetFigureType=GetFigureType;
	//获取指定图形点个数
	this.GetFigurePointNum=GetFigurePointNum;
	//获取图形的点集合,点的坐标为相对于图像左上点而言的位置 		
	this.GetFigurePoints=	GetFigurePoints;				
	//获得当前图像与(0,0)的偏移 如果返回为true获取成功，如果为false，超出图像范围
	this.GetShiftDistance=	GetShiftDistance;			
	//获得当前鼠标在图像中的位置
	this.GetCurrentCusorInImage=GetCurrentCusorInImage	;			
	//获得当前选中的图形ID集合
	this.GetCurrentSelectFigureIdSet=GetCurrentSelectFigureIdSet;		
	//获得当前的放大倍数
	this.GetZoomRate=GetZoomRate;					
	//设置当前缩放系数
	this.SetZoomRate=SetZoomRate;	
	//返回鼠标选中图形id
	this.GetCurrentSelectFigureId=GetCurrentSelectFigureId;	
	//获得最后一个图形形ID
	this.GetLastFigureId=GetLastFigureId;			
	this.GetFigureDrawStatus=GetFigureDrawStatus;	
	//设置当前绘图颜色
	this.SetDrawFigureColor=SetDrawFigureColor;			
	//修改图形ID
	this. SetFigureId=SetFigureId;	
	//控件与窗口的偏移 
	this.setControlShiftDistance=setControlShiftDistance;		
	//设置指定图形移动距离
	this.setFigureShiftDistance=setFigureShiftDistance;			
	//设置指定图形颜色
	this. SetFigureColor=SetFigureColor	;		
	//设置图形的名称
	this.SetFigureName=SetFigureName;
	//设置指定图形的保留字段内容
	this. SetFigureReservedData=SetFigureReservedData;
	//指定当前选中的图形
	this.SetCurrentSelectFigure=SetCurrentSelectFigure	;	
	//设置初始背景颜色
	//bshowAlways 是否背景颜色一直显示
	this. SetBackGroundColor=SetBackGroundColor;		
	//图像平移距离
	this. SetFigureShiftDistance=SetFigureShiftDistance;
	//移动所有图形
	this. SetMoveAllFigures=SetMoveAllFigures;
	//设置图像根据当前控件大小缩放
	this. SetFitFillControl=SetFitFillControl;
	//填充当前图形  
	this.FillFigure=FillFigure;
	//设置是否显示外围图形框
	this.SetShowFigureOutsideLine=SetShowFigureOutsideLine;
	//添加禁止拖动图像id
	this.AddForbiddenFigureId=AddForbiddenFigureId;
	//删除禁止拖动图像id
	this.DeleteForbiddenFigureId=DeleteForbiddenFigureId;
	//设置当前矩形为正方形
	this.SetRectToSquare=SetRectToSquare;
	//旋转图形
	this.RotateFigure=RotateFigure;
	//缩放图形
	this.ZoomFigure=ZoomFigure;
	//设置绘制多变行个数
	this.SetPolyPointCount=SetPolyPointCount;
	/************************************************************************/
	/* 
	设置标记点
	show  是否显示
	LabelPoint 屏幕坐标
	bOutSide  是否是外部坐标                                                                    
	*/
	/************************************************************************/
	this.ShowPositionLabel=ShowPositionLabel;		
	//获取鼠标所在位置
	//void GetCursorPosition(CPoint);								
	
	/************************************************************************/
	/* 
	PointData	点数据
	nPointNum	点个数
	COLORREF 图形颜色
	CString 图形名字
	strReservedDat 保留数据
	返回值:		新建图形ID
	*/
	/************************************************************************/
	//外部传入多边形方框
	this.O_DrawPolyFigure=O_DrawPolyFigure;
	//外部传入方框
	this.O_DrawRectFigure=O_DrawRectFigure;
	//外部传入圆 
	this.O_DrawCircleFigure=O_DrawCircleFigure;
	//外部传双方框  
	this.O_DrawDoubleRectFigure=O_DrawDoubleRectFigure;
		
	
	/************************************************************************/
	/* 用于修改控件内部图像数据内容  
	注：修改后数据无法还原
	所有通道的图像在控件内部都转换为RGBA处理，当需要修改单通道时，可以将RGB值都设为一样
	*/
	/************************************************************************/
	//修改图像单像素
	this.SetImagePix=SetImagePix;
	//获取图像单像素内容
	this.GetImagePix=GetImagePix;
					
	//从文件导入数据
	this.InitFigureControlFromFile=InitFigureControlFromFile  ;	
	//未初始化，用当前环境显示
	this.LoadImageFromFile=LoadImageFromFile;				
	
	
	this.CheckFigureGotoOutSide=CheckFigureGotoOutSide
	this.GetFigureOutsideRect=GetFigureOutsideRect	
	this.InitFigureControl();
}