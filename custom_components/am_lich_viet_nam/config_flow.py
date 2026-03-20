def _save_event_to_json(self, event_data):
        """Hàm ghi file chạy ở luồng phụ (Executor) để không chặn HA"""
        file_path = self.hass.config.path(DOMAIN, FILE_EVENTS)
        events = []
        if os.path.exists(file_path):
            with open(file_path, "r", encoding="utf-8") as f:
                try:
                    events = json.load(f)
                except ValueError:
                    pass
        
        # Chỉ tạo ID nếu chưa có
        if "id" not in event_data:
            event_data["id"] = str(uuid.uuid4())
            
        events.append(event_data)
        
        with open(file_path, "w", encoding="utf-8") as f:
            json.dump(events, f, ensure_ascii=False, indent=4)

    # (Giữ nguyên hàm async_step_user của bạn)

    async def async_step_event_am_lich(self, user_input=None):
        if user_input is not None:
            event_data = {
                "id": str(uuid.uuid4()), # Sinh ID từ gốc để cả JSON và Entry đều dùng chung
                "type": "lunar",
                "event_name": user_input.get("event_name"),
                "event_date": user_input.get("event_date"),
                "event_details": user_input.get("event_details", "")
            }
            # 1. Lưu vào file events.json
            await self.hass.async_add_executor_job(self._save_event_to_json, event_data.copy())
            
            # 2. Tạo một Tích hợp (Entry) độc lập (không cần gọi reload JSON nữa)
            return self.async_create_entry(
                title=user_input.get("event_name"), 
                data=event_data
            )

        return self.async_show_form(
            step_id="event_am_lich",
            data_schema=vol.Schema({
                vol.Required("event_name"): str,
                vol.Required("event_date", description={"suggested_value": "15/8"}): str,
                vol.Optional("event_details"): selector.TextSelector(
                    selector.TextSelectorConfig(multiline=True)
                ),
            })
        )

    async def async_step_event_duong_lich(self, user_input=None):
        if user_input is not None:
            event_data = {
                "id": str(uuid.uuid4()),
                "type": "solar",
                "event_name": user_input.get("event_name"),
                "event_date": user_input.get("event_date"),
                "event_details": user_input.get("event_details", "")
            }
            # 1. Lưu vào file events.json
            await self.hass.async_add_executor_job(self._save_event_to_json, event_data.copy())
            
            # 2. Tạo Tích hợp độc lập
            return self.async_create_entry(
                title=user_input.get("event_name"), 
                data=event_data
            )

        return self.async_show_form(
            step_id="event_duong_lich",
            data_schema=vol.Schema({
                vol.Required("event_name"): str,
                vol.Required("event_date", description={"suggested_value": "1/1"}): str,
                vol.Optional("event_details"): selector.TextSelector(
                    selector.TextSelectorConfig(multiline=True)
                ),
            })
        )
