import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useMemo, useState } from "react";
import { Box, Button, Divider, IconButton, InputAdornment, List, ListItem, ListItemButton, ListItemText, Paper, Stack, TextField, Tooltip, Typography, } from "@mui/material";
import ShuffleIcon from "@mui/icons-material/Shuffle";
import RefreshIcon from "@mui/icons-material/Refresh";
export function HeroRandomizer({ heroes, onRandomPick, selectedHeroId, }) {
    const [searchText, setSearchText] = useState("");
    const filteredHeroes = useMemo(() => {
        if (!searchText.trim()) {
            return heroes;
        }
        const lowered = searchText.toLowerCase();
        return heroes.filter((hero) => [hero.localizedName, hero.shortName, hero.roles?.join(" ") || ""].some((value) => value?.toLowerCase().includes(lowered)));
    }, [heroes, searchText]);
    const handleRandomPick = () => {
        if (!filteredHeroes.length) {
            return;
        }
        const randomIndex = Math.floor(Math.random() * filteredHeroes.length);
        const hero = filteredHeroes[randomIndex];
        onRandomPick(hero);
    };
    return (_jsx(Paper, { elevation: 3, sx: { p: 3 }, children: _jsxs(Stack, { spacing: 2, children: [_jsxs(Stack, { direction: "row", alignItems: "center", justifyContent: "space-between", children: [_jsx(Typography, { variant: "h6", children: "\u30E9\u30F3\u30C0\u30E0\u30D4\u30C3\u30AF" }), _jsx(Tooltip, { title: "\u30E9\u30F3\u30C0\u30E0\u9078\u629E", children: _jsx("span", { children: _jsx(Button, { variant: "contained", startIcon: _jsx(ShuffleIcon, {}), onClick: handleRandomPick, disabled: !filteredHeroes.length, children: "\u30E9\u30F3\u30C0\u30E0\u30D4\u30C3\u30AF" }) }) })] }), _jsx(TextField, { value: searchText, onChange: (event) => setSearchText(event.target.value), placeholder: "\u30D2\u30FC\u30ED\u30FC\u3092\u691C\u7D22 (\u540D\u524D\u30FB\u30ED\u30FC\u30EB)", size: "small", InputProps: {
                        endAdornment: (_jsx(InputAdornment, { position: "end", children: _jsx(IconButton, { "aria-label": "clear search", onClick: () => setSearchText(""), edge: "end", size: "small", children: _jsx(RefreshIcon, { fontSize: "small" }) }) })),
                    } }), _jsxs(Typography, { variant: "caption", color: "text.secondary", children: ["\u5019\u88DC\u30D2\u30FC\u30ED\u30FC: ", filteredHeroes.length, " / ", heroes.length] }), _jsx(Divider, {}), _jsxs(List, { dense: true, disablePadding: true, sx: { maxHeight: 260, overflowY: "auto" }, children: [!filteredHeroes.length ? (_jsx(ListItem, { children: _jsx(Typography, { variant: "body2", color: "text.secondary", children: "\u6761\u4EF6\u306B\u5408\u81F4\u3059\u308B\u30D2\u30FC\u30ED\u30FC\u304C\u898B\u3064\u304B\u308A\u307E\u305B\u3093\u3067\u3057\u305F\u3002" }) })) : null, filteredHeroes.map((hero) => {
                            const isSelected = hero.id === selectedHeroId;
                            return (_jsx(ListItemButton, { onClick: () => onRandomPick(hero), selected: isSelected, sx: { borderRadius: 1, mb: 0.5 }, children: _jsx(ListItemText, { primary: _jsxs(Stack, { direction: "row", spacing: 1, alignItems: "center", children: [_jsx(Box, { component: "img", src: hero.icon, alt: hero.localizedName, width: 32, height: 32, sx: { borderRadius: "50%", objectFit: "cover" } }), _jsx(Typography, { variant: "subtitle2", children: hero.localizedName })] }), secondary: `ロール: ${hero.roles.join(", ")}` }) }, hero.id));
                        })] })] }) }));
}
