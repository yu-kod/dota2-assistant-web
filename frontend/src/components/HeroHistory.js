import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import dayjs from "dayjs";
import { Avatar, List, ListItem, ListItemAvatar, ListItemButton, ListItemText, Paper, Stack, Typography, } from "@mui/material";
export function HeroHistory({ items, onSelect }) {
    if (!items.length) {
        return (_jsx(Paper, { elevation: 1, sx: { p: 3 }, children: _jsx(Typography, { variant: "subtitle2", color: "text.secondary", children: "\u307E\u3060\u5C65\u6B74\u306F\u3042\u308A\u307E\u305B\u3093\u3002\u30E9\u30F3\u30C0\u30E0\u30D4\u30C3\u30AF\u3092\u884C\u3046\u3068\u3053\u3053\u306B\u8868\u793A\u3055\u308C\u307E\u3059\u3002" }) }));
    }
    return (_jsx(Paper, { elevation: 1, sx: { p: 3 }, children: _jsxs(Stack, { spacing: 2, children: [_jsx(Typography, { variant: "h6", children: "\u6700\u8FD1\u306E\u30D4\u30C3\u30AF\u5C65\u6B74" }), _jsx(List, { dense: true, disablePadding: true, children: items.map((item) => (_jsx(ListItem, { disablePadding: true, children: _jsxs(ListItemButton, { onClick: () => onSelect(item.hero), children: [_jsx(ListItemAvatar, { children: _jsx(Avatar, { src: item.hero.icon, alt: item.hero.localizedName }) }), _jsx(ListItemText, { primary: item.hero.localizedName, secondary: dayjs(item.timestamp).format("MM/DD HH:mm") })] }) }, `${item.hero.id}-${item.timestamp}`))) })] }) }));
}
