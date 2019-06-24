---
title: ModbusTcp
layout: post
---
## 代码:

	#pragma pack(2)
	struct MesCommuStruct
	{
		WORD wStatus;
		DWORD dwTotal;
		DWORD dwError;
		DWORD dwGood;
		WORD wAlarm;
	};
	#pragma pack()
	
	std::string sendMessage(const char* receive_message,int nLength)
	{
		//目前收到的数据长度都是12，且必须等于12
		if (nLength!=12)
		{
			return std::string();
		}
		//数据转换时，需要将word用htons函数转化字节序，dword用htons转化字节序
		MesCommuStruct data;
		switch (CParameterCfg::m_SysStatus.m_nStatus)
		{
		case 0:
			data.wStatus = 0;
			data.wAlarm = htons(1);
			break;
		case 1:
			data.wStatus = htons(1);
			data.wAlarm = htons(1);
			break;
		case 2:
			data.wStatus = htons(1);
			data.wAlarm = htons(1);
			break;
		case 3:
			data.wStatus = htons(2);
			data.wAlarm = 0;
			break;
		default:
			break;
		}
		data.dwTotal = ntohl(_nTotalCount);
		data.dwError = ntohl(nErrorCount;
		data.dwGood = ntohl(nGoodCount);
	//固定包头
	std::string strResult;
	for (int i = 0; i <= 4; i++)
	{
		strResult.push_back((char)(receive_message[i]));
	}
	
	char strAddr[2], strCou[2];
	strAddr[0] = receive_message[9];
	strAddr[1] = receive_message[8];
	
	strCou[0] = receive_message[11];
	strCou[1] = receive_message[10];
	
	unsigned short nStartAddress = *reinterpret_cast<unsigned short*>(strAddr)*2;
	unsigned short nReadCount = *reinterpret_cast<unsigned short*>(strCou);
	
	//一个word等于两个char
	int nReadCharCount = nReadCount * 2;
	//字符串数据区总长度
	strResult.push_back(3+ nReadCharCount);
	//设备地址
	strResult.push_back(1);
	//功能码
	strResult.push_back(3);
	//数据长度
	strResult.push_back(nReadCharCount);
	
	int nCount = 0;
	for (int nIndex= nStartAddress;nIndex<sizeof(MesCommuStruct);nIndex++)
	{
		if (nCount >= nReadCharCount)
		{
			break;
		}	
		strResult.push_back(reinterpret_cast<char*>(&data)[nIndex]);	
		nCount++;		
	}
	
	//超出有效数据，补0
	for (int nIndex= nCount; nIndex<nReadCharCount;nIndex++)
	{
		strResult.push_back(0);
	}
	
	return strResult;
}