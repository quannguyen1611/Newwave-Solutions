export enum EPermissions {
    CmsUserCreate = 'cms_user_create',
    CmsUserRead = 'cms_user_read',
    CmsUserUpdate = 'cms_user_update',
    CmsUserDelete = 'cms_user_delete',
  
    CmsRoleCreate = 'cms_role_create',
    CmsRoleRead = 'cms_role_read',
    CmsRoleUpdate = 'cms_role_update',
    CmsRoleDelete = 'cms_role_delete',
  
    CmsTrailerTypeCreate = 'cms_trailer_type_create',
    CmsTrailerTypeRead = 'cms_trailer_type_read',
    CmsTrailerTypeUpdate = 'cms_trailer_type_update',
    CmsTrailerTypeDelete = 'cms_trailer_type_delete',
  
    CmsTrailerRenterCreate = 'cms_trailer_renter_create',
    CmsTrailerRenterRead = 'cms_trailer_renter_read',
    CmsTrailerRenterUpdate = 'cms_trailer_renter_update',
    CmsTrailerRenterDelete = 'cms_trailer_renter_delete',
  
    CmsYardCreate = 'cms_yard_create',
    CmsYardRead = 'cms_yard_read',
    CmsYardUpdate = 'cms_yard_update',
    CmsYardDelete = 'cms_yard_delete',
  
    CmsCustomerCreate = 'cms_customer_create',
    CmsCustomerRead = 'cms_customer_read',
    CmsCustomerUpdate = 'cms_customer_update',
    CmsCustomerDelete = 'cms_customer_delete',
  
    CmsDriverCreate = 'cms_driver_create',
    CmsDriverRead = 'cms_driver_read',
    CmsDriverUpdate = 'cms_driver_update',
    CmsDriverDelete = 'cms_driver_delete',
  
    CmsStatusCreate = 'cms_status_create',
    CmsStatusRead = 'cms_status_read',
    CmsStatusUpdate = 'cms_status_update',
    CmsStatusDelete = 'cms_status_delete',
  
    CmsEquipmentModelCreate = 'cms_equipment_model_create',
    CmsEquipmentModelRead = 'cms_equipment_model_read',
    CmsEquipmentModelUpdate = 'cms_equipment_model_update',
    CmsEquipmentModelDelete = 'cms_equipment_model_delete',
  
    CmsEquipmentClassCreate = 'cms_equipment_class_create',
    CmsEquipmentClassRead = 'cms_equipment_class_read',
    CmsEquipmentClassUpdate = 'cms_equipment_class_update',
    CmsEquipmentClassDelete = 'cms_equipment_class_delete',
  
    CmsAttachmentPartnoCreate = 'cms_attachment_partno_create',
    CmsAttachmentPartnoRead = 'cms_attachment_partno_read',
    CmsAttachmentPartnoUpdate = 'cms_attachment_partno_update',
    CmsAttachmentPartnoDelete = 'cms_attachment_partno_delete',
  
    CmsAttachmentClassCreate = 'cms_attachment_class_create',
    CmsAttachmentClassRead = 'cms_attachment_class_read',
    CmsAttachmentClassUpdate = 'cms_attachment_class_update',
    CmsAttachmentClassDelete = 'cms_attachment_class_delete',
  
    CmsDealerCreate = 'cms_dealer_create',
    CmsDealerRead = 'cms_dealer_read',
    CmsDealerUpdate = 'cms_dealer_update',
    CmsDealerDelete = 'cms_dealer_delete',
  
    CmsMaintenanceItemCreate = 'cms_maintenance_item_create',
    CmsMaintenanceItemRead = 'cms_maintenance_item_read',
    CmsMaintenanceItemUpdate = 'cms_maintenance_item_update',
    CmsMaintenanceItemDelete = 'cms_maintenance_item_delete',
  
    PortalTrailerCheckin = 'portal_trailer_checkin',
    PortalTrailerCheckout = 'portal_trailer_checkout',
    PortalTrailerCreate = 'portal_trailer_create',
    PortalTrailerRead = 'portal_trailer_read',
    PortalTrailerUpdate = 'portal_trailer_update',
    PortalTrailerDelete = 'portal_trailer_delete',
  
    PortalVehicleCheckin = 'portal_vehicle_checkin',
    PortalVehicleCheckout = 'portal_vehicle_checkout',
  
    PortalEquipmentCheckin = 'portal_equipment_checkin',
    PortalEquipmentCheckout = 'portal_equipment_checkout',
    PortalEquipmentCreate = 'portal_equipment_create',
    PortalEquipmentRead = 'portal_equipment_read',
    PortalEquipmentUpdate = 'portal_equipment_update',
    PortalEquipmentDelete = 'portal_equipment_delete',
  
    PortalAttachmentCheckin = 'portal_attachment_checkin',
    PortalAttachmentCheckout = 'portal_attachment_checkout',
    PortalAttachmentCreate = 'portal_attachment_create',
    PortalAttachmentRead = 'portal_attachment_read',
    PortalAttachmentUpdate = 'portal_attachment_update',
    PortalAttachmentDelete = 'portal_attachment_delete',
  
    PortalScheduleCreate = 'portal_schedule_create',
    PortalScheduleRead = 'portal_schedule_read',
    PortalScheduleUpdate = 'portal_schedule_update',
    PortalScheduleDelete = 'portal_schedule_delete',
  
    PortalMaintenanceWorkorderCreate = 'portal_maintenance_workorder_create',
    PortalMaintenanceWorkorderRead = 'portal_maintenance_workorder_read',
    PortalMaintenanceWorkorderUpdate = 'portal_maintenance_workorder_update',
    PortalMaintenanceWorkorderDelete = 'portal_maintenance_workorder_delete',
  
    PortalMaintenanceDownreportCreate = 'portal_maintenance_downreport_create',
    PortalMaintenanceDownreportRead = 'portal_maintenance_downreport_read',
    PortalMaintenanceDownreportUpdate = 'portal_maintenance_downreport_update',
    PortalMaintenanceDownreportDelete = 'portal_maintenance_downreport_delete',
    PortalExercise = 'portal_exercise',
  
    PortalPdiCreate = 'portal_pdi_create',
    PortalPdiRead = 'portal_pdi_read',
    PortalPdiUpdate = 'portal_pdi_update',
    PortalPdiDelete = 'portal_pdi_delete',
    PortalBillingSetting = 'portal_billing_setting',
  
    PortalBillingMaintenanceView = 'portal_billing_maintenance_view',
    PortalBillingMaintenanceExport = 'portal_billing_maintenance_export',
  
    PortalBillingDealerView = 'portal_billing_dealer_view',
    PortalBillingDealerExport = 'portal_billing_dealer_export',
  
    PortalBillingAttachmentView = 'portal_billing_attachment_view',
    PortalBillingAttachmentExport = 'portal_billing_attachment_export',
  
    PortalBillingEquipmentView = 'portal_billing_equipment_view',
    PortalBillingEquipmentExport = 'portal_billing_equipment_export',
  
    PortalBillingTrailerView = 'portal_billing_trailer_view',
    PortalBillingTrailerExport = 'portal_billing_trailer_export',
  
    AppTrailerCheckin = 'app_trailer_checkin',
    AppTrailerCheckout = 'app_trailer_checkout',
  
    AppVehicleCheckin = 'app_vehicle_checkin',
    AppVehicleCheckout = 'app_vehicle_checkout',
  
    AppEquipmentCheckin = 'app_equipment_checkin',
    AppEquipmentCheckout = 'app_equipment_checkout',
  
    AppAttachmentCheckin = 'app_attachment_checkin',
    AppAttachmentCheckout = 'app_attachment_checkout',
  
    AppScheduleCreate = 'app_schedule_create',
    AppScheduleRead = 'app_schedule_read',
    AppScheduleUpdate = 'app_schedule_update',
    AppScheduleDelete = 'app_schedule_delete',
  
    AppMaintenanceWorkorderCreate = 'app_maintenance_workorder_create',
    AppMaintenanceWorkorderRead = 'app_maintenance_workorder_read',
    AppMaintenanceWorkorderUpdate = 'app_maintenance_workorder_update',
    AppMaintenanceWorkorderDelete = 'app_maintenance_workorder_delete',
  
    AppMaintenanceDownreportCreate = 'app_maintenance_downreport_create',
    AppMaintenanceDownreportRead = 'app_maintenance_downreport_read',
    AppMaintenanceDownreportUpdate = 'app_maintenance_downreport_update',
    AppMaintenanceDownreportDelete = 'app_maintenance_downreport_delete',
    AppExercise = 'app_exercise',
  
    AppPdiCreate = 'app_pdi_create',
    AppPdiRead = 'app_pdi_read',
    AppPdiUpdate = 'app_pdi_update',
    AppPdiDelete = 'app_pdi_delete',
  }
  
  