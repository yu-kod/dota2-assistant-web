import { createElement as _createElement } from "react";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Autocomplete, Box, Button, Chip, Stack, TextField, Typography, } from "@mui/material";
export function HeroPositionsEditor({ positions, defaultPositions, availablePositions, onChange, }) {
    const isModified = JSON.stringify([...positions].sort()) !==
        JSON.stringify([...defaultPositions].sort());
    return (_jsxs(Stack, { spacing: 1, children: [_jsx(Typography, { variant: "subtitle2", color: "text.secondary", children: "\u30DD\u30B8\u30B7\u30E7\u30F3\u306E\u30AB\u30B9\u30BF\u30DE\u30A4\u30BA" }), _jsx(Autocomplete, { multiple: true, options: availablePositions, value: positions, onChange: (_event, value, _reason) => onChange(value), renderInput: (params) => (_jsx(TextField, { ...params, placeholder: "\u30DD\u30B8\u30B7\u30E7\u30F3\u3092\u8FFD\u52A0", size: "small" })), renderTags: (value, getTagProps) => value.map((option, index) => (_createElement(Chip, { label: option, ...getTagProps({ index }), key: option, size: "small" }))) }), isModified ? (_jsx(Box, { textAlign: "right", children: _jsx(Button, { size: "small", onClick: () => onChange(defaultPositions), children: "\u30C7\u30D5\u30A9\u30EB\u30C8\u306B\u623B\u3059" }) })) : null] }));
}
