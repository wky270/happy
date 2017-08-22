<template>
	<Form :model="service" :label-width="100">
		<div class="layout-titleColor title-padding">合作商服务管理列表</div>
		<Row>
			<Col span="6" class="form-padding">
				<Form-item label="合作商名称:">
					<Input v-model="search.partnerName" placeholder="请输入合作商名称"></Input>
				</Form-item>
			</Col>
			<Col span="6" class="form-padding">
				<Form-item label="服务名称:">
					<Input  v-model="search.serviceCode" placeholder="请输入服务名称"></Input>
				</Form-item>
			</Col>
			<Col span="6" class="form-padding">
				<Form-item label="状态:">
					<Select v-model="search.status" style="text-align: left;">
						<Option value="">未选择</Option>
						<Option value="0">在用</Option>
						<Option value="1">停用</Option>
					</Select>
				</Form-item>
			</Col>
		</Row>
		<Row>
			<Col span="6" class="form-padding">
				<Form-item label="开通日期：" >
                    <Date-picker type="date" v-model="search.startDate" placeholder="请选择"></Date-picker>
                </Form-item>
			</Col>
			<Col span="6" class="form-padding">
				<Form-item label="到期日期：" >
                    <Date-picker type="date" v-model="search.endDate" placeholder="请选择" ></Date-picker>
                </Form-item>
			</Col>
		</Row>
		<Row>
			<Col span="16">
				<Button type="info" @click="search()">搜索</Button>
				<Button @click="serviceAdd">新增</Button>
				<Modal  ref="modalAdd" title="新增服务"  v-model="modalAdd" width="350" :closable="false" :mask-closable="false">
                            <Form  ref="service" :model="service" :label-width="100" :rules="ruleInlineAdd">
                                <Form-item prop="partnerName"  label="合作商名称：" >
                                    <Select  v-model="service.partnerName" style="text-align: left;">
										<Option value="省工程">省工程</Option>
										<Option value="中时讯">中时讯</Option>
										<Option value="深圳工程">深圳工程</Option>
										<Option value="南建">南建</Option>
									</Select>
                                </Form-item>
                                <Form-item prop="serviceCode" label="服务名称：">
                                    <Select  v-model="service.serviceCode" style="text-align: left;">
										<Option value="信息服务">信息服务</Option>
										<Option value="融资服务">融资服务</Option>
										<Option value="结算服务">结算服务</Option>
									</Select>
                                </Form-item>
                                 <Form-item  prop="account" label="账号：">
                                    <Input type="text" v-model="service.account" ></Input>
                                </Form-item>
                                <Form-item prop="startDate" label="服务开通日期：" >
                                    <Date-picker type="date" v-model="service.startDate" placeholder="请选择" style="text-align: left;" ></Date-picker>
                                </Form-item>
                                 <Form-item prop="endDate" label="服务到期日期："  >
                                    <Date-picker type="date" v-model="service.endDate" placeholder="请选择" style="text-align: left;" ></Date-picker>
                                </Form-item>
                                <Form-item  prop="status" label="状态:">
									<Select v-model="service.status" style="text-align: left;">
										<Option value="0">在用</Option>
										<Option value="1">停用</Option>
									</Select>
								</Form-item>
                            </Form>
                            <div slot="footer">
                                <i-button  type="text" size="large" @click.native="resetCancel('service','modalAdd')">取消</i-button>
                                <i-button type="primary" size="large" @click="addService('service')">保存</i-button>
                            </div>
                        </Modal>
				<Button @click="serviceDetail">编辑</Button>
				<Modal  ref="modalDetail" title="编辑服务" v-model="modalDetail" width="350" :closable="false" :mask-closable="false">
                            <Form ref="serviceEdit" :model="serviceEdit" :label-width="100" :rules="ruleInlineEdit">
                                <Form-item prop="partnerName" label="合作商名称：" >
                                    <Select  v-model="serviceEdit.partnerName" style="text-align: left;">
                                    	<Option value="省工程">省工程</Option>
										<Option value="中时讯">中时讯</Option>
										<Option value="深圳工程">深圳工程</Option>
										<Option value="南建">南建</Option>
									</Select>
                                </Form-item>
                                <Form-item prop="serviceCode" label="服务名称：">
                                    <Select  v-model="serviceEdit.serviceCode" style="text-align: left;">
										<Option value="信息服务">信息服务</Option>
										<Option value="融资服务">融资服务</Option>
										<Option value="结算服务">结算服务</Option>
									</Select>
                                </Form-item>
                                 <Form-item prop="account" label="账号：">
                                    <Input type="text" v-model="serviceEdit.account" ></Input>
                                </Form-item>
                                <Form-item prop="startDate" label="服务开通日期：" >
                                    <Date-picker type="date" v-model="serviceEdit.startDate" style="text-align: left;" placeholder="请选择" ></Date-picker>
                                </Form-item>
                                 <Form-item prop="endDate" label="服务到期日期：" >
                                    <Date-picker type="date" v-model="serviceEdit.endDate" style="text-align: left;" placeholder="请选择" ></Date-picker>
                                </Form-item>
								<Form-item  prop="status" label="状态:">
									<Select  v-model="serviceEdit.status" style="text-align: left;">
										<Option value="0">在用</Option>
										<Option value="1">停用</Option>
									</Select>
								</Form-item>
                            </Form>
                            <div slot="footer">
                                <i-button  type="text" size="large" @click.native="resetCancel('serviceEdit','modalDetail')">取消</i-button>
                                <i-button type="primary" size="large" @click="serviceUpdate('serviceEdit')">保存</i-button>
                            </div>
                        </Modal>
				
				<Button @click="del">删除</Button>
				<Modal
					v-model="modalDel"
					title="是否删除服务信息"
					width="300"
					@on-ok="okDel"
					@on-cancel="cancelDel">
					<p>确定删除吗？</p>
				</Modal>
				
			</Col>
		</Row>
		<Row style="margin-top:10px;">
			<Col span="24">
				<Table border :columns="columns4" :data="dataList" @on-selection-change="check"></Table>
			</Col>
		</Row>
		<Row style="margin-top:10px;">
			<Col span="24">
				<Page :total="totalCount" :current="pageNum" show-total show-sizer show-elevator @on-change="refresh" @on-page-size-change="pageNumSize"></Page>
			</Col>
		</Row>
	</Form>
</template>

<script src="./ITSM.js"></script>

