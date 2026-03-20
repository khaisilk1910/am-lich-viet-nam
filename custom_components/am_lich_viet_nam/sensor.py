async def async_setup_entry(hass: HomeAssistant, entry: ConfigEntry, async_add_entities: AddEntitiesCallback):
    is_main = entry.data.get("is_main", entry.data.get("event_name") is None)
    
    if is_main:
        async_add_entities([AmLichSensor(entry)], True)
        active_entities = {}

        async def load_and_add_entities():
            events = await hass.async_add_executor_job(load_events_from_file, hass)
            
            # Lấy danh sách ID của các sự kiện ĐÃ được tạo Entry riêng biệt
            current_entries = hass.config_entries.async_entries(DOMAIN)
            entry_event_ids = [e.data.get("id") for e in current_entries if not e.data.get("is_main") and "id" in e.data]

            new_entities = []
            file_needs_update = False 
            
            for ev in events:
                ev_id = ev.get("id")
                
                # Tự động cấp ID nếu người dùng gõ tay
                if not ev_id: 
                    ev_id = str(uuid.uuid4())
                    ev["id"] = ev_id
                    file_needs_update = True
                    _LOGGER.info(f"Đã tự động tạo ID mới cho sự kiện gõ tay: {ev.get('event_name')}")
                
                # CÚ CHỐT: Nếu ID sự kiện đã nằm trong một Entry độc lập, bỏ qua không tạo Entity gộp nữa
                if ev_id in entry_event_ids:
                    continue

                if ev_id not in active_entities:
                    if ev.get("type") == "solar":
                        entity = DuongLichEventSensor(ev_id, ev)
                    else:
                        entity = AmLichEventSensor(ev_id, ev)
                    
                    new_entities.append(entity)
                    active_entities[ev_id] = entity
                else:
                    entity = active_entities[ev_id]
                    entity.update_data(ev)
                    entity.async_schedule_update_ha_state(True)

            if new_entities:
                async_add_entities(new_entities, True)

            if file_needs_update:
                def save_corrected_json():
                    file_path = hass.config.path(DOMAIN, FILE_EVENTS)
                    with open(file_path, "w", encoding="utf-8") as f:
                        json.dump(events, f, ensure_ascii=False, indent=4)
                await hass.async_add_executor_job(save_corrected_json)

        @callback
        def handle_reload_signal():
            hass.async_create_task(load_and_add_entities())

        async_dispatcher_connect(hass, SIGNAL_RELOAD_EVENTS, handle_reload_signal)
        await load_and_add_entities()
        
    else:
        # Nhánh này để khởi tạo các Entity cho các Tích hợp độc lập (Entries nằm ngoài)
        event_type = entry.data.get("type", entry.data.get("event_type", "lunar"))
        
        # Ta dùng entry.entry_id làm unique_id để đảm bảo HA không nhầm lẫn
        if event_type == "solar":
            async_add_entities([DuongLichEventSensor(entry.entry_id, entry.data)], True)
        else:
            async_add_entities([AmLichEventSensor(entry.entry_id, entry.data)], True)
